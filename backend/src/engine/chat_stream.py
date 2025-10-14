from abc import abstractmethod
from typing import AsyncIterator
from engine.models import ChatContext


class ChatStream:
    @abstractmethod
    async def __aiter__(self) -> AsyncIterator[ChatContext]: ...
