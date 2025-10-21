from core.enums import ConnectionType
from core.models import CustomBaseModel


class UserCreate(CustomBaseModel):
    username: str
    password: str


class UserLogin(CustomBaseModel):
    username: str
    password: str


class DiscordConnection(CustomBaseModel):
    user_id: int


class UserMe(CustomBaseModel):
    username: str
    connections: dict[ConnectionType, DiscordConnection] | None = None
