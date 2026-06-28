from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.game import Game
from app.schemas.game import GameResponse

router = APIRouter(
    prefix="/games",
    tags=["Games"]
)


@router.get(
    "/",
    response_model=list[GameResponse]
)
def get_games(
    db: Session = Depends(get_db)
):
    return db.query(Game).all()
