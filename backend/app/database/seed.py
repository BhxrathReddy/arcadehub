from app.database.session import SessionLocal
from app.models.achievement import Achievement
from app.models.game import Game


GAMES = [
    {
        "name": "Snake",
        "description": "Eat food, grow longer, and avoid crashing."
    },
    {
        "name": "Memory Match",
        "description": "Flip cards and find every matching pair."
    },
    {
        "name": "Typing Test",
        "description": "Type the prompt quickly and accurately."
    },
    {
        "name": "Tic Tac Toe",
        "description": "Classic three-in-a-row strategy game."
    },
    {
        "name": "Whack A Mole",
        "description": "React quickly and hit each target."
    }
]

ACHIEVEMENTS = [
    {
        "name": "First Game",
        "description": "Play your first game"
    },
    {
        "name": "Snake Master",
        "description": "Score 500 in Snake"
    },
    {
        "name": "Memory Genius",
        "description": "Complete Memory Match"
    },
    {
        "name": "Typing Pro",
        "description": "Reach 60 WPM"
    },
    {
        "name": "Level 5",
        "description": "Reach level 5"
    }
]


def seed_games(db):
    created = 0

    for game_data in GAMES:
        existing = (
            db.query(Game)
            .filter(
                Game.name == game_data["name"]
            )
            .first()
        )

        if existing:
            continue

        db.add(
            Game(**game_data)
        )
        created += 1

    return created


def seed_achievements(db):
    created = 0

    for achievement_data in ACHIEVEMENTS:
        existing = (
            db.query(Achievement)
            .filter(
                Achievement.name == achievement_data["name"]
            )
            .first()
        )

        if existing:
            continue

        db.add(
            Achievement(**achievement_data)
        )
        created += 1

    return created


def seed_database():
    db = SessionLocal()

    try:
        games_created = seed_games(db)
        achievements_created = seed_achievements(db)
        db.commit()

        return {
            "games_created": games_created,
            "achievements_created": achievements_created
        }

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    result = seed_database()

    print(
        "Seed complete: "
        f"{result['games_created']} games created, "
        f"{result['achievements_created']} achievements created"
    )
