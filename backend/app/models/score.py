from datetime import datetime

from sqlalchemy import (
    ForeignKey,
    Integer,
    DateTime
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    game_id: Mapped[int] = mapped_column(
        ForeignKey("games.id")
    )

    score: Mapped[int] = mapped_column(
        Integer
    )

    played_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="scores"
    )

    game = relationship(
        "Game",
        back_populates="scores"
    )