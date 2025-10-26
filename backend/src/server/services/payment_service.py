import json
import logging
from typing import Any

from sqlalchemy import update
import stripe

from config import (
    REDIS_CLIENT,
    REDIS_STRIPE_INVOICE_METADATA_KEY,
    REDIS_STRIPE_INVOICE_METADATA_KEY_PREFIX,
    STRIPE_PRICING_PRO_WEBHOOOK_SECRET,
)
from core.enums import PricingTierType
from db_models import Users
from server.services.email_service import EmailService
from utils.db import get_db_sess


logger = logging.getLogger("payment_service")


class VerificationError(Exception):
    pass


class PaymentService:
    _handlers: dict | None = None
    _email_service: EmailService | None = None

    @classmethod
    async def handle_event(cls, event_bytes: bytes, sig_header: str) -> bool:
        if not cls._handlers:
            cls._handlers = {
                "invoice.payment_succeeded": cls._handle_invoice_payment_succeeded,
                "invoice.payment_failed": cls._handle_invoice_payment_failed,
                "checkout.session.completed": cls._handle_checkout_session_succeeded,
                "subscription_schedule.expiring": cls._handle_subscription_expiring,
            }
        if not cls._email_service:
            cls._email_service = EmailService("No-Reply", "no-replay@gova.chat")

        try:
            event = stripe.Webhook.construct_event(
                payload=event_bytes,
                sig_header=sig_header,
                secret=STRIPE_PRICING_PRO_WEBHOOOK_SECRET,
            )
        except stripe.SignatureVerificationError:
            raise VerificationError("Invalid signature.")

        event_type = event.get("type")
        func = cls._handlers.get(event_type)
        if func:
            return await func(event)

        logger.warning(f"Handler for event type '{event_type}' not found.")
        return False

    @classmethod
    async def _handle_checkout_session_succeeded(cls, event: dict[str, Any]):
        await REDIS_CLIENT.set(
            f"{REDIS_STRIPE_INVOICE_METADATA_KEY_PREFIX}{event["data"]["object"]["invoice"]}",
            str(event["data"]["object"]["metadata"]),
        )
        return True

    @classmethod
    async def _handle_invoice_payment_failed(cls, event: dict[str, Any]): ...

    @classmethod
    async def _handle_invoice_payment_succeeded(cls, event: dict[str, Any]):
        invoice_id = event["data"]["object"]["id"]
        redis_key = f"{REDIS_STRIPE_INVOICE_METADATA_KEY_PREFIX}{invoice_id}"
        metadata: dict | None = await REDIS_CLIENT.get(redis_key)

        if not metadata:
            logger.info("No metadata found for invoice id")
            return False

        await REDIS_CLIENT.delete(redis_key)

        user_id = json.loads(metadata).get("user_id")
        if not user_id:
            logger.info("No user id found within invoice metadata")
            return False
        
        async with get_db_sess() as db_sess:
            await db_sess.execute(
                update(Users)
                .values(pricing_tier=PricingTierType.PRO.value)
                .where(Users.user_id == user_id)
            )
            await db_sess.commit()
        
        return True

    @classmethod
    async def _handle_subscription_expiring(cls, event: dict[str, Any]): ...
