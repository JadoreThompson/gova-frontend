import asyncio
import logging
import discord

from config import DISCORD_BOT_TOKEN
from engine.discord.actions import DiscordAction
from engine.discord.action_handler import DiscordActionHandler
from engine.discord.context import DiscordMessageContext


logger = logging.getLogger("discord_action_manager")


class DiscordActionManager:
    _client: discord.Client | None = None
    _handler: DiscordActionHandler | None = None
    _task: asyncio.Task | None = None

    @classmethod
    def _initialise(cls) -> None: ...

    @classmethod
    async def start(cls) -> None:
        if not cls._client:
            intents = discord.Intents.default()
            cls._client = discord.Client(intents=intents)
            cls._task = asyncio.create_task(cls._client.start(token=DISCORD_BOT_TOKEN))

        if not cls._handler:
            cls._handler = DiscordActionHandler(cls._client, logger)

    @classmethod
    async def stop(cls) -> None:
        if cls._task and not cls._task.done():
            cls._task.cancel()
            try:
                await cls._task
            except asyncio.CancelledError:
                pass
            cls._task = None

        cls._handler = None

    @classmethod
    async def handle(cls, action: DiscordAction, ctx: DiscordMessageContext) -> bool:
        return await cls._handler.handle(action, ctx)
