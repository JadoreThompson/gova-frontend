from typing import Literal
from pydantic import BaseModel, Field
from core.enums import ChatPlatformType
from core.models import CustomBaseModel
from .actions import Action


class PromptValidation(BaseModel):
    malicious: Literal[1, 2, 3] = Field(
        description="1 being not malicious, 2 being malicious and 3 being unknown"
    )


class ChatContext(CustomBaseModel):
    platform: ChatPlatformType
    message: str


class ChatEvaluation(CustomBaseModel):
    evaluation_score: float
    action: Action | None
