from dataclasses import dataclass
from datetime import datetime
from typing import NamedTuple
from uuid import UUID


@dataclass
class JWTPayload:
    sub: UUID
    exp: datetime


class Identity(NamedTuple):
    username: str | None
    avatar: str | None
    success: bool


# TODO: Convert to base model and move to shared
class Guild(NamedTuple):
    id: int
    name: str
    icon: str | None


class GuildChannel(NamedTuple):
    id: int
    name: str
