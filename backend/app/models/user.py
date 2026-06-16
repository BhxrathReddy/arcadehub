from datetime import datetime

from sqlalchemy import (
    String,
    Integer,
    DateTime
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True
    )

    password_hash: Mapped[str] = mapped_column(
        String(255)
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    xp: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    level: Mapped[int] = mapped_column(
        Integer,
        default=1
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    scores = relationship(
        "Score",
        back_populates="user"
    )