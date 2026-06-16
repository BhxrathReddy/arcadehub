from fastapi import APIRouter

router = APIRouter(
    prefix="/scores",
    tags=["Scores"]
)
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.models.score import Score
from app.models.game import Game
from app.models.user import User

from app.schemas.score import (
    ScoreCreate,
    ScoreResponse
)

from app.auth.dependencies import (
    get_current_user
)
from sqlalchemy import desc

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

    db.commit()
    db.refresh(score)

    return score

@router.get(
    "/leaderboard/{game_id}"
)
def leaderboard(
    game_id: int,
    db: Session = Depends(get_db)
):

    scores = (
        db.query(Score)
        .filter(
            Score.game_id == game_id
        )
        .order_by(
            desc(Score.score)
        )
        .limit(20)
        .all()
    )

    return [
        {
            "rank": index + 1,
            "username": score.user.username,
            "score": score.score
        }
        for index, score in enumerate(scores)
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

@router.get("/global")
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