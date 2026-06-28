from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement


def unlock_achievement(
    user_id: int,
    achievement_name: str,
    db
):
    achievement = (
        db.query(Achievement)
        .filter(
            Achievement.name == achievement_name
        )
        .first()
    )

    if not achievement:
        return

    existing = (
        db.query(UserAchievement)
        .filter(
            UserAchievement.user_id == user_id,
            UserAchievement.achievement_id == achievement.id
        )
        .first()
    )

    if existing:
        return

    db.add(
        UserAchievement(
            user_id=user_id,
            achievement_id=achievement.id
        )
    )


def check_achievements(
    user,
    score,
    game_id,
    db
):
    # First Game
    unlock_achievement(
        user.id,
        "First Game",
        db
    )

    # Snake Master
    if game_id == 1 and score >= 500:
        unlock_achievement(
            user.id,
            "Snake Master",
            db
        )

    # Memory Genius
    if game_id == 2:
        unlock_achievement(
            user.id,
            "Memory Genius",
            db
        )

    # Typing Pro
    if game_id == 3 and score >= 6000:
        unlock_achievement(
            user.id,
            "Typing Pro",
            db
        )

    # Tic Tac Toe Champ
    if game_id == 4 and score >= 100:
        unlock_achievement(
            user.id,
            "Tic Tac Toe Champ",
            db
        )

    # Mole Hunter
    if game_id == 5 and score >= 100:
        unlock_achievement(
            user.id,
            "Mole Hunter",
            db
        )

    # Level 5
    if user.level >= 5:
        unlock_achievement(
            user.id,
            "Level 5",
            db
        )
