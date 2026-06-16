from app.database.session import SessionLocal

from app.models.game import Game


games = [
    "Snake",
    "Memory Match",
    "Typing Test",
    "Tic Tac Toe",
    "Whack A Mole"
]


db = SessionLocal()

for name in games:

    existing = (
        db.query(Game)
        .filter(Game.name == name)
        .first()
    )

    if not existing:
        db.add(
            Game(name=name)
        )

db.commit()

print("Games seeded")