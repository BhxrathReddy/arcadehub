from sqlalchemy import ForeignKey

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


class UserAchievement(Base):

    __tablename__ = "user_achievements"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        primary_key=True
    )

    achievement_id: Mapped[int] = mapped_column(
        ForeignKey("achievements.id"),
        primary_key=True
    )

    user = relationship(
        "User",
        back_populates="achievements"
    )

    achievement = relationship(
        "Achievement",
        back_populates="users"
    )
