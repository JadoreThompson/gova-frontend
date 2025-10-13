from pydantic import EmailStr
from core.models import CustomBaseModel


class UserCreate(CustomBaseModel):
    username: str
    username: EmailStr
    password: str


class UserLogin(CustomBaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str
