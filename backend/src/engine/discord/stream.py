import asyncio
import logging
from typing import AsyncIterator, Literal

import discord

from engine.base_stream import BaseChatStream
from .context import DiscordMessageContext, DiscordContext


logger = logging.getLogger("discord-stream")


class DiscordStream(BaseChatStream):
    def __init__(
        self,
        client: discord.Client,
        guild_id: int,
        allowed_channels: list[int | Literal["*"]],
    ) -> None:
        super().__init__()
        self._client: discord.Client = client
        self._guild_id = guild_id
        self._allowed_channels = set(allowed_channels)
        self._allowed_all_channels = allowed_channels[0] == "*"
        self._msg_queue: asyncio.Queue[discord.Message] = asyncio.Queue()

    @property
    def client(self) -> discord.Client | None:
        return self._client

    def append_events(self) -> None:
        @self._client.event
        async def on_ready():
            logger.info(f"Logged in as {self._client.user}")

        @self._client.event
        async def on_message(msg: discord.Message):
            if msg.guild.id != self._guild_id:
                return

            if (
                not self._allowed_all_channels
                and msg.channel.id not in self._allowed_channels
            ):
                return

            self._msg_queue.put_nowait(msg)

            if msg.content.startswith("$hello"):
                await msg.channel.send("Hello!")

    async def __aiter__(self) -> AsyncIterator[DiscordMessageContext]:
        while True:
            item = await self._msg_queue.get()
            ctx = DiscordMessageContext(
                discord=DiscordContext(
                    user_id=item.author.id,
                    channel_id=item.channel.id,
                    guild_id=item.guild.id,
                ),
                content=item.content,
            )
            yield ctx
