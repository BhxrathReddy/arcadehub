from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database.dependencies import get_db
from app.models.game import Game

router = APIRouter(
    prefix="/games",
    tags=["Games"]
)


@router.get("/")
def get_games(
    db: Session = Depends(get_db)
):
    return db.query(Game).all()