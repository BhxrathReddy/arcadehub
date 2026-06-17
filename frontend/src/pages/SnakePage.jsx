import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/api";

const GRID_SIZE = 20;
const CELL_SIZE = 24;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const INITIAL_DIRECTION = "RIGHT";
const SPEED_MS = 150;

export default function SnakePage() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  // Refs to always have fresh values inside the interval callback
  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const gameOverRef = useRef(gameOver);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // ── Submit score ────────────────────────────────────────────────────────────
  async function submitScore(finalScore) {
    try {
      await api.post("/scores", { game_id: 1, score: finalScore });
    } catch (error) {
      console.error("Failed to submit score", error);
    }
  }

  // ── Random food that never spawns on the snake ──────────────────────────────
  function randomFood(currentSnake) {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
  }

  // ── Core move logic (reads only from refs — no stale closures) ──────────────
  const moveSnake = useCallback(() => {
    if (gameOverRef.current) return;

    const currentSnake = snakeRef.current;
    const currentDir = directionRef.current;
    const currentFood = foodRef.current;

    const head = { ...currentSnake[0] };

    switch (currentDir) {
      case "UP":    head.y--; break;
      case "DOWN":  head.y++; break;
      case "LEFT":  head.x--; break;
      case "RIGHT": head.x++; break;
      default: break;
    }

    // Wall collision
    if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE) {
      setGameOver(true);
      submitScore(scoreRef.current);
      return;
    }

    // Self collision
    if (currentSnake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameOver(true);
      submitScore(scoreRef.current);
      return;
    }

    const newSnake = [head, ...currentSnake];

    // Food collision
    if (head.x === currentFood.x && head.y === currentFood.y) {
      const newScore = scoreRef.current + 10;
      scoreRef.current = newScore;
      setScore(newScore);
      setFood(randomFood(newSnake));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, []);

  // ── Game loop ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(moveSnake, SPEED_MS);
    return () => clearInterval(interval);
  }, [started, gameOver, moveSnake]);

  // ── Keyboard controls ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent page scroll on arrow keys
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      if (!started && !gameOver) {
        setStarted(true);
      }

      setDirection((prev) => {
        switch (e.key) {
          case "ArrowUp":    return prev !== "DOWN"  ? "UP"    : prev;
          case "ArrowDown":  return prev !== "UP"    ? "DOWN"  : prev;
          case "ArrowLeft":  return prev !== "RIGHT" ? "LEFT"  : prev;
          case "ArrowRight": return prev !== "LEFT"  ? "RIGHT" : prev;
          default:           return prev;
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, gameOver]);

  // ── Reset ───────────────────────────────────────────────────────────────────
  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setScore(0);
    setGameOver(false);
    setStarted(false);
    scoreRef.current = 0;
  }

  // ── Mobile swipe controls ───────────────────────────────────────────────────
  const touchStartRef = useRef(null);

  function handleTouchStart(e) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e) {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // too small

    if (!started && !gameOver) setStarted(true);

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      setDirection((prev) => {
        if (dx > 0) return prev !== "LEFT"  ? "RIGHT" : prev;
        else        return prev !== "RIGHT" ? "LEFT"  : prev;
      });
    } else {
      // Vertical swipe
      setDirection((prev) => {
        if (dy > 0) return prev !== "UP"   ? "DOWN" : prev;
        else        return prev !== "DOWN" ? "UP"   : prev;
      });
    }

    touchStartRef.current = null;
  }

  // ── On-screen D-pad button handler ─────────────────────────────────────────
  function handleDpad(newDir) {
    if (!started && !gameOver) setStarted(true);
    setDirection((prev) => {
      const opposites = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      return prev !== opposites[newDir] ? newDir : prev;
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white select-none p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2 tracking-widest text-green-400">
        SNAKE
      </h1>

      {/* Score */}
      <div className="text-lg mb-4 text-gray-300">
        Score: <span className="font-bold text-white">{score}</span>
      </div>

      {/* Game Over Banner */}
      {gameOver && (
        <div className="mb-4 text-center bg-gray-800 border border-red-500 rounded-lg px-8 py-4">
          <h2 className="text-2xl font-bold text-red-400 mb-1">Game Over</h2>
          <p className="text-gray-300 mb-3">Final Score: <span className="font-bold text-white">{score}</span></p>
          <button
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded transition-colors"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Start hint */}
      {!started && !gameOver && (
        <p className="mb-3 text-gray-400 text-sm animate-pulse">
          Press any arrow key or swipe to start
        </p>
      )}

      {/* Game Grid */}
      <div
        className="border-2 border-gray-600 bg-gray-800 rounded"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);

          const isHead  = snake[0].x === x && snake[0].y === y;
          const isBody  = !isHead && snake.slice(1).some((s) => s.x === x && s.y === y);
          const isFood  = food.x === x && food.y === y;

          let bgColor = "#1f2937"; // empty cell: gray-800
          let borderRadius = "2px";
          if (isHead)  { bgColor = "#86efac"; borderRadius = "4px"; } // green-300
          if (isBody)  { bgColor = "#22c55e"; }                       // green-500
          if (isFood)  { bgColor = "#ef4444"; borderRadius = "50%"; } // red-500

          return (
            <div
              key={index}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: bgColor,
                borderRadius,
                border: "1px solid #111827", // grid lines
              }}
            />
          );
        })}
      </div>

      {/* Mobile D-Pad */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <button
          className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-xl active:bg-gray-500"
          onClick={() => handleDpad("UP")}
        >
          ▲
        </button>
        <div className="flex gap-1">
          <button
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-xl active:bg-gray-500"
            onClick={() => handleDpad("LEFT")}
          >
            ◀
          </button>
          <div className="w-12 h-12" />
          <button
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-xl active:bg-gray-500"
            onClick={() => handleDpad("RIGHT")}
          >
            ▶
          </button>
        </div>
        <button
          className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-xl active:bg-gray-500"
          onClick={() => handleDpad("DOWN")}
        >
          ▼
        </button>
      </div>
    </div>
  );
}