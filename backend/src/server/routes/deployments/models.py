from datetime import datetime
from typing import Any
from uuid import UUID

from engine.discord.config import DiscordConfig
from core.enums import MessagePlatformType, ModeratorDeploymentStatus
from core.models import CustomBaseModel


class DeploymentBase(CustomBaseModel):
    platform: MessagePlatformType
    name: str
    conf: dict[str, Any]


class DeploymentUpdate(CustomBaseModel):
    name: str | None = None
    conf: dict[str, Any] | None = None


class DeploymentResponse(CustomBaseModel):
    deployment_id: UUID
    moderator_id: UUID
    platform: MessagePlatformType
    name: str
    conf: DiscordConfig
    status: ModeratorDeploymentStatus
    created_at: datetime
