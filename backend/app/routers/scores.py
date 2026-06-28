from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.score import Score
from app.models.game import Game
from app.models.user import User
from app.schemas.score import (
    GlobalLeaderboardEntry,
    LeaderboardEntry,
    ScoreCreate,
    ScoreResponse
)
from app.services.achievement_service import (
    check_achievements
)
from app.auth.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/scores",
    tags=["Scores"]
)

@router.post(
    "/",
    response_model=ScoreResponse
)
def submit_score(
    data: ScoreCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    game = db.get(
        Game,
        data.game_id
    )

    if not game:
        raise HTTPException(
            status_code=404,
            detail="Game not found"
        )

    score = Score(
        user_id=current_user.id,
        game_id=data.game_id,
        score=data.score
    )

    db.add(score)

    current_user.xp += 10

    current_user.level = (
    current_user.xp // 100) + 1
    check_achievements(
    current_user,
    data.score,
    data.game_id,
    db
)
    db.commit()
    db.refresh(score)

    return score

@router.get(
    "/leaderboard/{game_id}",
    response_model=list[LeaderboardEntry]
)
def leaderboard(
    game_id: int,
    db: Session = Depends(get_db)
):
    best_score = func.max(
        Score.score
    ).label("best_score")

    rows = (
        db.query(
            User.username,
            best_score
        )
        .join(Score, Score.user_id == User.id)
        .filter(
            Score.game_id == game_id
        )
        .group_by(User.id, User.username)
        .order_by(
            desc(best_score)
        )
        .limit(20)
        .all()
    )

    return [
        {
            "rank": index + 1,
            "username": row.username,
            "score": row.best_score
        }
        for index, row in enumerate(rows)
    ]

@router.get("/my-scores")
def my_scores(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    scores = (
        db.query(Score)
        .filter(
            Score.user_id ==
            current_user.id
        )
        .order_by(
            Score.played_at.desc()
        )
        .all()
    )

    return scores

@router.get(
    "/global",
    response_model=list[GlobalLeaderboardEntry]
)
def global_leaderboard(
    db: Session = Depends(get_db)
):

    users = (
        db.query(User)
        .order_by(
            User.xp.desc()
        )
        .limit(50)
        .all()
    )

    return [
        {
            "rank": index + 1,
            "username": user.username,
            "xp": user.xp,
            "level": user.level
        }
        for index, user in enumerate(users)
    ]
