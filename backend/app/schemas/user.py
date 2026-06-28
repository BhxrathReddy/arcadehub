from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    model_config = {
        "from_attributes": True
    }


class UserMeResponse(UserResponse):
    xp: int
    level: int


class ProfileResponse(BaseModel):
    username: str
    email: str
    xp: int
    level: int
    games_played: int
    highest_score: int
