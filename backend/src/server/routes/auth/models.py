from pydantic import BaseModel
from typing import Literal

from core.enums import ConnectionType
from core.models import CustomBaseModel
from server.shared.models import PlatformConnection


class UserCreate(CustomBaseModel):
    username: str
    email: str
    password: str


class UserLogin(CustomBaseModel):
    username: str | None = None
    email: str | None = None
    password: str


class UserMe(CustomBaseModel):
    username: str
    connections: dict[ConnectionType, PlatformConnection] | None = None


class UpdateUsername(BaseModel):
    username: str


class UpdatePassword(BaseModel):
    password: str


class VerifyCode(BaseModel):
    code: str


class VerifyAction(VerifyCode):
    action: Literal["change_username", "change_password"]
