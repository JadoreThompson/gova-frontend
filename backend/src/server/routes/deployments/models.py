from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel

from core.enums import ActionStatus, MessagePlatformType
from core.models import CustomBaseModel
from server.shared.models import MessageChartData


class DeploymentBase(CustomBaseModel):
    platform: MessagePlatformType
    name: str
    conf: dict[str, Any]


class DeploymentUpdate(CustomBaseModel):
    name: str | None = None
    conf: dict[str, Any] | None = None


class DeploymentStats(BaseModel):
    total_messages: int
    total_actions: int
    message_chart: dict[MessagePlatformType, list[MessageChartData]]


class DeploymentAction(BaseModel):
    log_id: UUID
    deployment_id: UUID
    action_type: str
    action_params: dict
    status: ActionStatus
    created_at: datetime
