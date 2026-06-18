from pydantic import BaseModel


class AchievementResponse(
    BaseModel
):

    id: int
    name: str
    description: str

    model_config = {
        "from_attributes": True
    }