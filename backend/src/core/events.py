from uuid import UUID

from engine.discord.config import DiscordConfig
from core.models import CustomBaseModel
from core.enums import MessagePlatformType


class DeploymentEvent(CustomBaseModel):
    deployment_id: UUID
    moderator_id: UUID
    platform: MessagePlatformType
    conf: DiscordConfig
