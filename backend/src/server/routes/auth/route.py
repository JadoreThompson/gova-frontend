import asyncio

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy import insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from config import REDIS_CLIENT, REDIS_EMAIL_VERIFICATION_KEY
from utils.db import get_datetime
from core.enums import MessagePlatformType
from db_models import Users
from server.dependencies import depends_db_sess, depends_jwt
from server.services import DiscordService, EmailService, JWTService
from server.typing import JWTPayload
from .models import (
    PlatformConnection,
    UpdatePassword,
    UpdateUsername,
    UserCreate,
    UserLogin,
    UserMe,
    VerifyEmail,
)


router = APIRouter(prefix="/auth", tags=["Auth"])
em_service = EmailService("No-Reply", "no-reply@gova.chat")


@router.post("/register", status_code=202)
async def register(
    body: UserCreate,
    bg_tasks: BackgroundTasks,
    db_sess: AsyncSession = Depends(depends_db_sess),
):
    global em_service

    def gen_verification_code():
        import random
        import string

        return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

    res = await db_sess.scalar(
        select(Users).where(
            (Users.username == body.username) | (Users.email == body.email)
        )
    )
    if res is not None:
        raise HTTPException(status_code=400, detail="Username or email already exists.")

    new_user_id = await db_sess.scalar(
        insert(Users).values(**body.model_dump()).returning(Users.user_id)
    )

    verification_code = gen_verification_code()
    await REDIS_CLIENT.hset(
        REDIS_EMAIL_VERIFICATION_KEY, verification_code, str(new_user_id)
    )
    await REDIS_CLIENT.hexpire(REDIS_EMAIL_VERIFICATION_KEY, 60, verification_code)
    bg_tasks.add_task(
        em_service.send_email,
        body.email,
        "Verify your email",
        f"Your verification code is: {verification_code}",
    )
    await db_sess.commit()

    return {"message": "User registered successfully. Please verify your email."}


@router.post("/login")
async def login(body: UserLogin, db_sess: AsyncSession = Depends(depends_db_sess)):
    if (body.username is None or not body.username.strip()) and (
        body.email is None or not body.email.strip()
    ):
        return JSONResponse(
            status_code=400,
            content={"error": "Either username or email must be provided."},
        )

    res = await db_sess.execute(
        select(Users).where(
            Users.username == body.username, Users.password == body.password
        )
    )
    user = res.scalar_one_or_none()

    if user is None:
        return JSONResponse(status_code=401, content={"error": "Invalid user."})

    return JWTService.set_cookie(user)


@router.post("/verify-email")
async def verify_email(
    body: VerifyEmail, db_sess: AsyncSession = Depends(depends_db_sess)
):
    user_id = None
    user_id = await REDIS_CLIENT.hget(REDIS_EMAIL_VERIFICATION_KEY, str(body.code))
    if not user_id:
        raise HTTPException(
            status_code=400, detail="Invalid or expired verification code."
        )
    
    await REDIS_CLIENT.hdel(REDIS_EMAIL_VERIFICATION_KEY, str(body.code))

    user = await db_sess.scalar(
        update(Users)
        .where(Users.user_id == user_id)
        .values(authenticated_at=get_datetime())
        .returning(Users)
    )
    rsp = JWTService.set_cookie(user)
    await db_sess.commit()
    return rsp


@router.post("/logout")
async def logout(jwt: JWTPayload = Depends(depends_jwt)):
    return JWTService.remove_cookie()


@router.get("/me", response_model=UserMe)
async def get_me(
    jwt: JWTPayload = Depends(depends_jwt),
    db_sess: AsyncSession = Depends(depends_db_sess),
):
    async def wrapper(platform: MessagePlatformType, coro):
        identity = await coro
        return platform, identity

    user = await db_sess.scalar(select(Users).where(Users.user_id == jwt.sub))
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    funcs = {MessagePlatformType.DISCORD: DiscordService.fetch_identity}
    coros = []

    for plat, data in (user.connections or {}).items():
        func = funcs.get(plat)
        if func:
            coros.append(wrapper(plat, func(data)))

    plat_conns = {}
    if coros:
        res = await asyncio.gather(*coros)
        for plat, identity in res:
            plat_conns[plat] = PlatformConnection(
                username=identity.username, avatar=identity.avatar
            )

    return UserMe(username=user.username, connections=plat_conns)


@router.get("/discord/oauth")
async def discord_callback(
    code: str,
    jwt: JWTPayload = Depends(depends_jwt),
    db_sess: AsyncSession = Depends(depends_db_sess),
):
    data = await DiscordService.fetch_discord_access_token(code)

    conns = await db_sess.scalar(
        select(Users.connections).where(Users.user_id == jwt.sub)
    )
    if not conns:
        conns = {}

    conns[MessagePlatformType.DISCORD] = data
    await db_sess.execute(
        update(Users).values(connections=conns).where(Users.user_id == jwt.sub)
    )
    await db_sess.commit()

    return RedirectResponse(url="http://localhost:5173/connections")


@router.patch("/change-username")
async def change_username(
    body: UpdateUsername,
    jwt: JWTPayload = Depends(depends_jwt),
    db_sess: AsyncSession = Depends(depends_db_sess),
):
    # TODO: Auth and validation
    user = await db_sess.scalar(select(Users).where(Users.user_id == jwt.sub))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db_sess.execute(
        update(Users)
        .where(Users.user_id == user.user_id)
        .values(username=body.username)
    )
    await db_sess.commit()


@router.patch("/change-password")
async def change_password(
    body: UpdatePassword,
    jwt: JWTPayload = Depends(depends_jwt),
    db_sess: AsyncSession = Depends(depends_db_sess),
):
    # TODO: Auth and validation
    user = await db_sess.scalar(select(Users).where(Users.user_id == jwt.sub))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db_sess.execute(
        update(Users)
        .where(Users.user_id == user.user_id)
        .values(password=body.password)
    )
    await db_sess.commit()
