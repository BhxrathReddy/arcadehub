from app.database.seed import seed_achievements
from app.database.session import SessionLocal


db = SessionLocal()

try:
    created = seed_achievements(db)
    db.commit()
    print(f"Achievements seeded: {created} created")

except Exception:
    db.rollback()
    raise

finally:
    db.close()
