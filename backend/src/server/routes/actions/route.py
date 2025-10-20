from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.enums import ActionStatus, MessagePlatformType
from db_models import ModeratorDeploymentLogs, Moderators
from infra import DiscordActionManager
from server.dependencies import depends_db_sess, depends_jwt
from server.shared.models import DeploymentAction
from server.typing import JWTPayload
from .models import ActionUpdate


router = APIRouter(prefix="/actions", tags=["Actions"])


@router.patch("/{log_id}")
async def update_action_status(
    log_id: UUID,
    body: ActionUpdate,
    jwt: JWTPayload = Depends(depends_jwt),
    session: AsyncSession = Depends(depends_db_sess),
):
    log = await session.scalar(
        select(ModeratorDeploymentLogs)
        .join(
            Moderators, Moderators.moderator_id == ModeratorDeploymentLogs.moderator_id
        )
        .where(Moderators.user_id == jwt.sub, ModeratorDeploymentLogs.log_id == log_id)
    )

    if not log:
        raise HTTPException(status_code=404, detail="Action log not found")

    if body.status == ActionStatus.APPROVED:
        # Fulfilling action
        platform = log.action_params.get("platform")
        if platform == MessagePlatformType.DISCORD:
            success = await DiscordActionManager.handle(log.action_params, log.context)
        else:
            raise HTTPException(
                status_code=400, detail=f"Unknown platform '{platform}'."
            )

        status = ActionStatus.SUCCESS if success else ActionStatus.FAILED
    else:
        status = body.status

    log.status = status.value
    rsp_body = DeploymentAction(
        log_id=log.log_id,
        deployment_id=log.deployment_id,
        action_type=log.action_type,
        status=status,
        created_at=log.created_at,
    )
    await session.commit()

    return rsp_body
