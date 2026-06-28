from fastapi import APIRouter
from fastapi import Depends

from app.models.user import User

from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.auth.dependencies import get_current_user

from app.models.user_achievement import (
    UserAchievement
)
from app.models.achievement import Achievement
from app.schemas.achievement import (
    AchievementResponse,
    AchievementStatusResponse
)
from app.models.score import Score
from app.schemas.user import (
    ProfileResponse,
    UserMeResponse
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
@router.get(
    "/me",
    response_model=UserMeResponse
)
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
@router.get(
    "/profile",
    response_model=ProfileResponse
)
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


@router.get(
    "/achievements/all",
    response_model=list[
        AchievementStatusResponse
    ]
)
def get_all_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    unlocked_ids = {
        item.achievement_id
        for item in (
            db.query(UserAchievement)
            .filter(
                UserAchievement.user_id
                == current_user.id
            )
            .all()
        )
    }

    achievements = (
        db.query(Achievement)
        .order_by(Achievement.id)
        .all()
    )

    return [
        {
            "id": achievement.id,
            "name": achievement.name,
            "description": achievement.description,
            "unlocked": achievement.id in unlocked_ids
        }
        for achievement in achievements
    ]
