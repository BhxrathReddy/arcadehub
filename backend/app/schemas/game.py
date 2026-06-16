from pydantic import BaseModel


class GameResponse(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }