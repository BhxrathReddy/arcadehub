from fastapi import APIRouter
from fastapi import Depends

from app.models.user import User

from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.auth.dependencies import get_current_user

from app.models.user_achievement import (
    UserAchievement
)
from app.schemas.achievement import AchievementResponse
from app.models.score import Score

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
@router.get("/me")
def me(
    current_user: User = Depends(
        get_current_user
    )
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "xp": current_user.xp,
        "level": current_user.level
    }
@router.get("/profile")
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    scores = (
        db.query(Score)
        .filter(
            Score.user_id == current_user.id
        )
        .all()
    )
    games_played = len(scores)

    highest_score = (
        max(
            [score.score for score in scores],
            default=0
        )
    )

    return {
        "username": current_user.username,
        "email": current_user.email,
        "xp": current_user.xp,
        "level": current_user.level,
        "games_played": games_played,
        "highest_score": highest_score
    }
@router.get(
    "/achievements",
    response_model=list[
        AchievementResponse
    ]
)
def get_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    achievements = (
        db.query(UserAchievement)
        .filter(
            UserAchievement.user_id
            == current_user.id
        )
        .all()
    )

    return [
        item.achievement
        for item in achievements
    ]