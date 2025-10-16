from core.models import CustomBaseModel
from engine.discord.actions import DiscordAction


class DiscordConfig(CustomBaseModel):
    guild_id: int
    allowed_channels: list[int]  # Channel IDs
    allowed_actions: list[DiscordAction]
