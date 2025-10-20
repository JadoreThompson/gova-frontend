from datetime import datetime
from uuid import UUID

from core.enums import ActionStatus, MessagePlatformType, ModeratorDeploymentStatus
from core.models import CustomBaseModel
from engine.discord.config import DiscordConfig


class MessageChartData(CustomBaseModel):
    platform: MessagePlatformType
    frequency: int
    date: datetime


class DeploymentResponse(CustomBaseModel):
    deployment_id: UUID
    moderator_id: UUID
    platform: MessagePlatformType
    name: str
    conf: DiscordConfig
    status: ModeratorDeploymentStatus
    created_at: datetime


class DeploymentAction(CustomBaseModel):
    log_id: UUID
    deployment_id: UUID
    action_type: str
    action_params: dict
    status: ActionStatus
    created_at: datetime
