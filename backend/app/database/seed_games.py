from app.database.seed import seed_games
from app.database.session import SessionLocal


db = SessionLocal()

try:
    created = seed_games(db)
    db.commit()
    print(f"Games seeded: {created} created")

except Exception:
    db.rollback()
    raise

finally:
    db.close()
