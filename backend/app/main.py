from fastapi import FastAPI
from sqlalchemy import text

from app.database.session import SessionLocal

from app.routers import auth
from app.routers import games
from app.routers import scores
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import users
app = FastAPI(
    title="ArcadeHub API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(games.router)
app.include_router(scores.router)
app.include_router(users.router)
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
