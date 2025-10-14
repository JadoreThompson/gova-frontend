from abc import abstractmethod
from typing import Iterator
from engine.models import ChatContext


class ChatStream:
    @abstractmethod
    def __iter__(self) -> Iterator[ChatContext]: ...
