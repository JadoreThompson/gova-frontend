import asyncio
from aiohttp import ClientSession, ClientError
from pydantic import ValidationError

from config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL_NAME, SECURITY_SYSTEM_PROMPT
from utils.llm import parse_to_dict
from .models import PromptValidation


class PromptValidator:
    @classmethod
    async def validate_prompt(
        cls, prompt: str, sess: ClientSession | None = None, max_attempts: int = 3
    ) -> bool:
        """
        Validates that the incoming prompt isn't performing any prompt injection
        or malicious actions, with retry logic for transient failures.

        Args:
            prompt (str): The user prompt to validate.
            sess (ClientSession | None): Optional shared HTTP session.
            max_attempts (int): Max number of attempts before giving up.

        Returns:
            bool: Whether or not the prompt is malicious.
        """
        is_local = sess is None
        if is_local:
            sess = ClientSession(
                base_url=LLM_BASE_URL,
                headers={"Authorization": f"Bearer {LLM_API_KEY}"},
            )

        attempt = 0
        try:
            while attempt < max_attempts:
                attempt += 1
                try:
                    body = {
                        "model": LLM_MODEL_NAME,
                        "messages": [
                            {"role": "system", "content": SECURITY_SYSTEM_PROMPT},
                            {"role": "user", "content": prompt},
                        ],
                    }

                    rsp = await sess.post("/chat/completions", json=body)
                    rsp.raise_for_status()
                    data = await rsp.json()

                    content = data["choices"][0]["message"]["content"]
                    obj = PromptValidation(**parse_to_dict(content))
                    return obj

                except (ClientError, asyncio.TimeoutError, ValidationError) as e:
                    if attempt >= max_attempts:
                        return PromptValidation(malicious=3)

            return PromptValidation(malicious=3)

        finally:
            if is_local:
                await sess.close()
