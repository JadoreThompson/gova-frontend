from enum import Enum


class MessagePlatformType(Enum):
    DISCORD = "discord"


class ModeratorDeploymentStatus(Enum):
    OFFLINE = "offline"
    PENDING = "pending"
    ONLINE = "online"


class ActionStatus(Enum):
    PENDING = "pending"
    SUCCESS = "success"
    AWAITING_APPROVAL = "awaiting_approval"
    APPROVED = "approved"
