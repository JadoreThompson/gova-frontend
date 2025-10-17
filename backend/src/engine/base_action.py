from __future__ import annotations

from engine.discord.actions import DiscordActionType
from core.models import CustomBaseModel


class BaseAction(CustomBaseModel):
    type: DiscordActionType
    requires_approval: bool
    reason: str