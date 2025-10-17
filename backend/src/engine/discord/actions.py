from enum import Enum
from pydantic import Field

from backend.src.engine.base_action import BaseAction
from core.models import CustomBaseModel


class DiscordActionType(Enum):
    BAN = "ban"
    MUTE = "mute"


class DiscordAction(CustomBaseModel):
    type: DiscordActionType
    reason: str


class BanAction(BaseAction):
    type: DiscordActionType = DiscordActionType.BAN


class MuteAction(BaseAction):
    type: DiscordActionType = DiscordActionType.MUTE
    duration: int = Field(
        ..., ge=0, description="Duration in milliseconds to mute the user."
    )
