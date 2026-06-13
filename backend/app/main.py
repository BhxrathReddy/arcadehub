from fastapi import FastAPI
from sqlalchemy import text

from app.database.session import SessionLocal

app = FastAPI(
    title="ArcadeHub API"
)

@app.get("/")
def root():
    return {"message": "ArcadeHub API Running"}

@app.get("/health")
def health():
    db = SessionLocal()

    try:
        db.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    finally:
        db.close()