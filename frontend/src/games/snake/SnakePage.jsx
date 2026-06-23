import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../api/api";
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

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("snakeHighScore") || 0)
  );

  const [leaderboard, setLeaderboard] = useState([]);

  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const gameOverRef = useRef(gameOver);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const fetchLeaderboard =
    useCallback(async () => {
    try {
      const response = await api.get(
        "/scores/leaderboard/1"
      );

      setLeaderboard(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      try {
        const response = await api.get(
          "/scores/leaderboard/1"
        );

        if (isMounted) {
          setLeaderboard(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const submitScore =
    useCallback(async (finalScore) => {
    try {
      await api.post("/scores", {
        game_id: 1,
        score: finalScore,
      });

      await fetchLeaderboard();
    } catch (error) {
      console.error(
        "Failed to submit score",
        error
      );
    }
  }, [fetchLeaderboard]);

  function randomFood(currentSnake) {
    let pos;

    do {
      pos = {
        x: Math.floor(
          Math.random() * GRID_SIZE
        ),
        y: Math.floor(
          Math.random() * GRID_SIZE
        ),
      };
    } while (
      currentSnake.some(
        (s) =>
          s.x === pos.x &&
          s.y === pos.y
      )
    );

    return pos;
  }

  const moveSnake = useCallback(() => {
    if (gameOverRef.current) return;

    const currentSnake =
      snakeRef.current;

    const currentDir =
      directionRef.current;

    const currentFood =
      foodRef.current;

    const head = {
      ...currentSnake[0],
    };

    switch (currentDir) {
      case "UP":
        head.y--;
        break;

      case "DOWN":
        head.y++;
        break;

      case "LEFT":
        head.x--;
        break;

      case "RIGHT":
        head.x++;
        break;

      default:
        break;
    }

    // Wall collision
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= GRID_SIZE ||
      head.y >= GRID_SIZE
    ) {
      setGameOver(true);

      if (scoreRef.current > 0) {
        submitScore(scoreRef.current);
      }

      return;
    }

    // Self collision
    if (
      currentSnake
        .slice(1)
        .some(
          (s) =>
            s.x === head.x &&
            s.y === head.y
        )
    ) {
      setGameOver(true);

      if (scoreRef.current > 0) {
        submitScore(scoreRef.current);
      }

      return;
    }

    const newSnake = [
      head,
      ...currentSnake,
    ];

    if (
      head.x === currentFood.x &&
      head.y === currentFood.y
    ) {
      const newScore =
        scoreRef.current + 10;

      scoreRef.current =
        newScore;

      setScore(newScore);

      if (
        newScore > highScore
      ) {
        setHighScore(newScore);

        localStorage.setItem(
          "snakeHighScore",
          newScore
        );
      }

      setFood(
        randomFood(newSnake)
      );
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [highScore, submitScore]);

  useEffect(() => {
    if (!started || gameOver)
      return;

    const interval =
      setInterval(
        moveSnake,
        SPEED_MS
      );

    return () =>
      clearInterval(interval);
  }, [
    started,
    gameOver,
    moveSnake,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (
        !started &&
        !gameOver
      ) {
        setStarted(true);
      }

      setDirection((prev) => {
        switch (e.key) {
          case "ArrowUp":
            return prev !== "DOWN"
              ? "UP"
              : prev;

          case "ArrowDown":
            return prev !== "UP"
              ? "DOWN"
              : prev;

          case "ArrowLeft":
            return prev !==
              "RIGHT"
              ? "LEFT"
              : prev;

          case "ArrowRight":
            return prev !==
              "LEFT"
              ? "RIGHT"
              : prev;

          default:
            return prev;
        }
      });
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [started, gameOver]);

  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(
      INITIAL_DIRECTION
    );
    setFood(INITIAL_FOOD);
    setScore(0);
    setGameOver(false);
    setStarted(false);

    scoreRef.current = 0;
  }

  const touchStartRef =
    useRef(null);

  function handleTouchStart(e) {
    const t = e.touches[0];

    touchStartRef.current = {
      x: t.clientX,
      y: t.clientY,
    };
  }

  function handleTouchEnd(e) {
    if (!touchStartRef.current)
      return;

    const t =
      e.changedTouches[0];

    const dx =
      t.clientX -
      touchStartRef.current.x;

    const dy =
      t.clientY -
      touchStartRef.current.y;

    if (
      Math.abs(dx) < 10 &&
      Math.abs(dy) < 10
    )
      return;

    if (
      !started &&
      !gameOver
    ) {
      setStarted(true);
    }

    if (
      Math.abs(dx) >
      Math.abs(dy)
    ) {
      setDirection((prev) => {
        if (dx > 0) {
          return prev !==
            "LEFT"
            ? "RIGHT"
            : prev;
        }

        return prev !==
          "RIGHT"
          ? "LEFT"
          : prev;
      });
    } else {
      setDirection((prev) => {
        if (dy > 0) {
          return prev !== "UP"
            ? "DOWN"
            : prev;
        }

        return prev !==
          "DOWN"
          ? "UP"
          : prev;
      });
    }

    touchStartRef.current =
      null;
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4"
      onTouchStart={
        handleTouchStart
      }
      onTouchEnd={
        handleTouchEnd
      }
    >
      <h1 className="text-5xl font-extrabold mb-2 tracking-widest text-green-400">
        SNAKE
      </h1>

      <div className="text-lg mb-4">
        Score:
        <span className="font-bold ml-2">
          {score}
        </span>

        <span className="mx-3">
          |
        </span>

        High Score:
        <span className="font-bold text-yellow-400 ml-2">
          {highScore}
        </span>
      </div>

      {!started &&
        !gameOver && (
          <p className="mb-3 text-gray-400 animate-pulse">
            Press Arrow Keys
            To Start
          </p>
        )}

      {gameOver && (
        <div className="mb-4 text-center bg-gray-800 border border-red-500 rounded-lg p-4">

          <h2 className="text-2xl font-bold text-red-400">
            Game Over
          </h2>

          <p className="mb-3">
            Final Score:
            {" "}
            {score}
          </p>

          <h3 className="text-yellow-400 font-bold mb-3">
            Top Players
          </h3>

          <div className="space-y-2 mb-4">
            {leaderboard
              .slice(0, 10)
              .map(
                (player) => (
                  <div
                    key={
                      player.rank
                    }
                    className="flex justify-between bg-gray-700 px-4 py-2 rounded"
                  >
                    <span>
                      #
                      {player.rank}
                    </span>

                    <span>
                      {
                        player.username
                      }
                    </span>

                    <span className="font-bold text-green-400">
                      {
                        player.score
                      }
                    </span>
                  </div>
                )
              )}
          </div>

          <button
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded"
            onClick={
              resetGame
            }
          >
            Play Again
          </button>

        </div>
      )}

      <div
        className="border-2 border-gray-600 rounded"
        style={{
          display: "grid",
          gridTemplateColumns:
            `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({
          length:
            GRID_SIZE *
            GRID_SIZE,
        }).map((_, index) => {
          const x =
            index %
            GRID_SIZE;

          const y =
            Math.floor(
              index /
                GRID_SIZE
            );

          const isHead =
            snake[0].x === x &&
            snake[0].y === y;

          const isBody =
            !isHead &&
            snake
              .slice(1)
              .some(
                (s) =>
                  s.x ===
                    x &&
                  s.y === y
              );

          const isFood =
            food.x === x &&
            food.y === y;

          return (
            <div
              key={index}
              style={{
                width:
                  CELL_SIZE,
                height:
                  CELL_SIZE,
                backgroundColor:
                  isFood
                    ? "#ef4444"
                    : isHead
                    ? "#86efac"
                    : isBody
                    ? "#22c55e"
                    : "#1f2937",
                border:
                  "1px solid #111827",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
