from pydantic import BaseModel
from datetime import datetime


class ScoreCreate(BaseModel):
    game_id: int
    score: int


class ScoreResponse(BaseModel):
    id: int
    user_id: int
    game_id: int
    score: int
    played_at: datetime

    model_config = {
        "from_attributes": True
    }


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    score: int


class GlobalLeaderboardEntry(BaseModel):
    rank: int
    username: str
    xp: int
    level: int
