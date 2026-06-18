from app.database.session import SessionLocal

from app.models.achievement import Achievement


achievements = [
    (
        "First Game",
        "Play your first game"
    ),
    (
        "Snake Master",
        "Score 500 in Snake"
    ),
    (
        "Memory Genius",
        "Complete Memory Match"
    ),
    (
        "Typing Pro",
        "Reach 60 WPM"
    ),
    (
        "Level 5",
        "Reach level 5"
    )
]


db = SessionLocal()

for name, description in achievements:

    existing = (
        db.query(Achievement)
        .filter(
            Achievement.name == name
        )
        .first()
    )

    if not existing:

        db.add(
            Achievement(
                name=name,
                description=description
            )
        )

db.commit()

print("Achievements seeded successfully")