from datetime import datetime
from uuid import uuid4, UUID

from pgvector.sqlalchemy import Vector
from sqlalchemy import UUID as SaUUID, String, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import JSONB

from core.enums import ModeratorState
from utils.db import get_datetime


def get_uuid():
    return uuid4()


class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "users"

    user_id: Mapped[UUID] = mapped_column(
        SaUUID(as_uuid=True), primary_key=True, default=get_uuid
    )
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=get_datetime
    )

    # Relationship
    projects: Mapped[list["Projects"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Projects(Base):
    __tablename__ = "projects"

    project_id: Mapped[UUID] = mapped_column(
        SaUUID(as_uuid=True), primary_key=True, default=get_uuid
    )
    user_id: Mapped[UUID] = mapped_column(
        SaUUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    guidelines: Mapped[str] = mapped_column(String, nullable=True)
    topics: Mapped[list[str]] = mapped_column(JSONB, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=get_datetime,
        onupdate=get_datetime,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=get_datetime
    )

    # Relationship
    user: Mapped["Users"] = relationship(back_populates="projects")
    moderators: Mapped[list["Moderators"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )


class Moderators(Base):
    __tablename__ = "moderators"

    moderator_id: Mapped[UUID] = mapped_column(
        SaUUID(as_uuid=True), primary_key=True, default=get_uuid
    )
    project_id: Mapped[UUID] = mapped_column(
        SaUUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    platform: Mapped[str] = mapped_column(String, nullable=False)
    state: Mapped[str] = mapped_column(
        String, nullable=False, default=ModeratorState.OFFLINE.value
    )
    deployed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=get_datetime
    )

    # Relationships
    messages: Mapped[list["Messages"]] = relationship(
        back_populates="moderator", cascade="all, delete-orphan"
    )
    project: Mapped["Projects"] = relationship(back_populates="moderators")


class Messages(Base):
    __tablename__ = "messages"

    message_id: Mapped[UUID] = mapped_column(
        SaUUID(as_uuid=True), primary_key=True, default=get_uuid
    )
    project_id: Mapped[UUID] = mapped_column(
        SaUUID(as_uuid=True), ForeignKey("projects.project_id"), nullable=False
    )
    moderator_id: Mapped[UUID] = mapped_column(
        SaUUID(as_uuid=True), ForeignKey("moderators.moderator_id"), nullable=True
    )

    platform: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)

    embedding: Mapped[list[float]] = mapped_column(Vector(1536))

    evaluation: Mapped[dict] = mapped_column(JSONB, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=get_datetime
    )

    # Relationships
    project: Mapped["Projects"] = relationship(backref="messages")
    moderator: Mapped["Moderators"] = relationship(back_populates="messages")
