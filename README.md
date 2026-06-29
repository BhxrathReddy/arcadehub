# ArcadeHub

ArcadeHub is a full-stack arcade platform where users can create an account,
play browser games, submit scores, climb leaderboards, earn XP, level up, and
unlock achievements.

## Features

- User registration and login with JWT authentication
- Protected dashboard, profile, games, and leaderboard pages
- Five playable games:
  - Snake
  - Memory Match
  - Typing Test
  - Tic Tac Toe
  - Whack A Mole
- Per-game score submission
- Global XP leaderboard
- Game-specific leaderboards
- User profile with XP, level, stats, and achievements
- Locked and unlocked achievement display
- Seed scripts for default games and achievements
- Responsive UI polish for desktop and mobile

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT authentication

## Project Structure

```text
arcadehub/
  backend/
    app/
      auth/
      core/
      database/
      models/
      routers/
      schemas/
      services/
    alembic/
    requirements.txt

  frontend/
    src/
      api/
      components/
      context/
      games/
      pages/
      routes/
    package.json
```

## Backend Setup

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/arcadehub
JWT_SECRET_KEY=change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run database migrations:

```bash
alembic upgrade head
```

Seed games and achievements:

```bash
python -m app.database.seed
```

Start the API:

```bash
uvicorn app.main:app --reload
```

The API runs at:

```text
http://localhost:8000
```

## Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Useful Commands

Frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

Backend syntax check example:

```bash
cd backend
python -m py_compile app/main.py
```

## Seeded Data

The seed command creates these games:

- Snake
- Memory Match
- Typing Test
- Tic Tac Toe
- Whack A Mole

It also creates achievements such as:

- First Game
- Snake Master
- Memory Genius
- Typing Pro
- Tic Tac Toe Champ
- Mole Hunter
- Level 5

The seed command is safe to run more than once. It only adds missing records.

## Main App Flow

1. Register a new account.
2. Log in.
3. Choose a game from the dashboard or Games page.
4. Play and submit a score.
5. Check the leaderboard.
6. View XP, level, stats, and achievements on the profile page.

## Screenshots

Add screenshots here before sharing the project:

```text
docs/screenshots/login.png
docs/screenshots/dashboard.png
docs/screenshots/games.png
docs/screenshots/leaderboard.png
docs/screenshots/profile.png
```

## Future Improvements

- Add a custom 404 page
- Add sound effects or animations for games
- Add difficulty settings
- Add password validation messages
- Add automated backend tests
- Add screenshots or a demo GIF to this README

## Status

ArcadeHub is currently a working full-stack project with authentication,
multiple playable games, persistent scores, leaderboards, profiles, and
achievements.
