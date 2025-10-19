from datetime import datetime
from uuid import UUID

from core.enums import MessagePlatformType, ModeratorDeploymentStatus
from core.models import CustomBaseModel
from engine.discord.config import DiscordConfig


class DeploymentResponse(CustomBaseModel):
    deployment_id: UUID
    moderator_id: UUID
    platform: MessagePlatformType
    name: str
    conf: DiscordConfig
    status: ModeratorDeploymentStatus
    created_at: datetime


class MessageChartData(CustomBaseModel):
    platform: MessagePlatformType
    frequency: int
    date: datetime
