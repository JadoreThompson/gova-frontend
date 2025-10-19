from typing import Literal
from core.models import CustomBaseModel
from engine.base_action import BaseActionDefinition


class DiscordConfig(CustomBaseModel):
    guild_id: int
    allowed_channels: list[int | Literal["*"]]  # Channel IDs
    allowed_actions: list[BaseActionDefinition | Literal["*"]]
