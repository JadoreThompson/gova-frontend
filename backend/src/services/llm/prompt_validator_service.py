from aiohttp import ClientSession

from config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL_NAME, SECURITY_SYSTEM_PROMPT


class PromptValidatorService:
    @classmethod
    async def validate_prompt(cls, prompt: str, sess: ClientSession | None = None) -> bool:
        """
        Validates that the incoming prompt isn't performing any prompt injection
        or malicious actions

        Args:
            prompt (str): Prompt
            sess (ClientSession | None, optional): HTTP session. Defaults to None.

        Returns:
            bool: Whether or not the prompt is malicious.
        """
        is_local = sess is None
        if is_local:
            sess = ClientSession(base_url=LLM_BASE_URL, headers={"Authoriization": f"Bearer {LLM_API_KEY}"})

        try:
            sys_prompt = {
                "model": LLM_MODEL_NAME,
                "messages": [
                    {"role": "system", "content": SECURITY_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ]
            }
            await sess.get("/chat/completions", json={})
        finally:
            if is_local:
                await sess.close()