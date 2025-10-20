from core.enums import ActionStatus
from core.models import CustomBaseModel


class ActionUpdate(CustomBaseModel):
    status: ActionStatus.APPROVED | ActionStatus.DECLINED