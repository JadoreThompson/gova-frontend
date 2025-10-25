import json
import logging
from datetime import datetime

import stripe
from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from config import (
    REDIS_CLIENT,
    REDIS_STRIPE_INVOICE_METADATA_KEY,
    STRIPE_PRICING_PRO_PRICE_ID,
    STRIPE_PRICING_PRO_WEBHOOOK_SECRET
)
from core.enums import PricingTierType
from db_models import Users
from server.dependencies import depends_db_sess, depends_jwt
from server.typing import JWTPayload
from sqlalchemy import select, update


logger = logging.getLogger("paymnents_router")
router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/payment-link")
async def get_payment_link(
    jwt: JWTPayload = Depends(depends_jwt),
    db_sess: AsyncSession = Depends(depends_db_sess),
):
    """Generate a Stripe Checkout link for a given user and pricing tier."""

    # Prevent upgrading to the same tier
    if jwt.pricing_tier == PricingTierType.PRO:
        raise HTTPException(status_code=400, detail="User already has PRO access.")

    user = await db_sess.scalar(select(Users).where(Users.user_id == jwt.sub))

    customer_id = None
    if user and user.payment_info and "customer_id" in user.payment_info:
        customer_id = user.payment_info["customer_id"]

    # Create a new Stripe customer if none exists
    if not customer_id:
        try:
            customer = stripe.Customer.create(
                name=str(jwt.sub),
                email=jwt.em,
                metadata={"user_id": str(jwt.sub)},
            )
            customer_id = customer.id
            if user:
                user.payment_info = user.payment_info or {}
                user.payment_info["customer_id"] = customer_id
                db_sess.add(user)
                await db_sess.commit()
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to create customer: {e}"
            )

    # Create the checkout session
    try:
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            line_items=[
                {
                    "price": STRIPE_PRICING_PRO_PRICE_ID,
                    "quantity": 1,
                }
            ],
            mode="subscription",
            success_url="https://formula1.com",
            cancel_url="https://x.com",
            expires_at=int(datetime.now().timestamp() + 3600),
            metadata={"user_id": str(jwt.sub)},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create checkout session: {e}"
        )

    return RedirectResponse(url=checkout_session.url)


@router.post("/stripe/webhook")
async def stripe_webhook(
    req: Request, db_sess: AsyncSession = Depends(depends_db_sess)
):
    """Stripe webhook endpoint for handling subscription events."""
    payload = await req.body()
    sig_header = req.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=STRIPE_PRICING_PRO_WEBHOOOK_SECRET,
        )
    except stripe.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload.")

    event_type = event.get("type")

    if event_type == "invoice.payment_succeeded":
        invoice_id = event["data"]["object"]["id"]
        metadata: dict | None = await REDIS_CLIENT.hget(
            REDIS_STRIPE_INVOICE_METADATA_KEY, invoice_id
        )
        if metadata:
            await REDIS_CLIENT.hdel(REDIS_STRIPE_INVOICE_METADATA_KEY, invoice_id)
            user_id = json.loads(metadata).get("user_id")
            if user_id:
                await db_sess.execute(
                    update(Users)
                    .values(pricing_tier=PricingTierType.PRO.value)
                    .where(Users.user_id == user_id)
                )
                await db_sess.commit()
    elif event_type == "checkout.session.completed":
        await REDIS_CLIENT.hset(
            REDIS_STRIPE_INVOICE_METADATA_KEY,
            event["data"]["object"]["invoice"],
            str(event["data"]["object"]["metadata"]),
        )
    else:
        logger.warning(f"Unhandled event type: {event_type}")

    return {"received": True}
