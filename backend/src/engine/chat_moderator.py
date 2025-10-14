import json
import os
from uuid import UUID

from aiohttp import ClientSession

from config import (
    FINAL_PROMPT,
    LLM_API_KEY,
    LLM_BASE_URL,
    LLM_MODEL_NAME,
    RESOURCES_PATH,
    SCORE_SYSTEM_PROMPT,
)
from core.enums import ActionType, ChatPlatformType
from engine.actions import BanAction, MuteAction
from engine.models import ChatContext, ChatEvaluation
from engine.prompt_validator import PromptValidator
from utils.db import get_db_sess
from utils.llm import parse_to_dict


class ChatModerator:
    def __init__(self, project_id: UUID) -> None:
        self._project_id = project_id
        self._http_sess = ClientSession(
            base_url=LLM_BASE_URL, headers={"Authorization": f"Bearer {LLM_API_KEY}"}
        )
        self._topics: list[str] = None

        with open(os.path.join(RESOURCES_PATH, "guidelines.txt")) as f:
            self._guidelines = f.read()

    async def evaluate(
        self, ctx: ChatContext, max_attempts: int = 3
    ) -> ChatEvaluation | None:
        malicious = await PromptValidator.validate_prompt(ctx.message)
        if malicious:
            return

        if self._topics:
            topics = await self._fetch_topics()
            if not topics:
                return

        # Fetching topic scores
        sys_prompt = SCORE_SYSTEM_PROMPT.format(
            guidelines=self._guidelines, topics=self._topics
        )
        topic_scores: dict[str, float] = await self._fetch_llm_response(
            [
                {
                    "model": LLM_MODEL_NAME,
                    "messages": [
                        {"role": "system", "content": sys_prompt},
                        {
                            "role": "user",
                            "content": json.dumps(ctx.to_serialisable_dict()),
                        },
                    ],
                }
            ],
        )

        # Final Output
        prompt = FINAL_PROMPT.format(
            guidelines=self._guidelines,
            topics=self._topics,
            topic_scores=topic_scores,
            actions=ActionType._value2member_map_.keys(),
            message=ctx.message,
            action_formats=[
                BanAction.model_json_schema(),
                MuteAction.model_json_schema(),
            ],
            context={
                "platform": "discord",
                "data": {"channel": "general", "server": "sneakbots"},
            },
        )
        data = await self._fetch_llm_response([{"role": "user", "content": prompt}])
        return ChatEvaluation(**data)

    async def _fetch_llm_response(self, messages: list[dict]) -> str:
        body = {"model": LLM_MODEL_NAME, "mmessages": messages}
        rsp = await self._http_sess.get("/chat/completions", json=body)
        rsp.raise_for_status()
        data = await rsp.json()
        return parse_to_dict(**data["choices"][0]["message"]["content"])

    async def _fetch_topics(self, platform: ChatPlatformType) -> list[str]:
        async with get_db_sess() as db_sess:
            res = await db_sess.scalars()
            topics = res.all()

        return topics
