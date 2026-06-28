import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../api/api";

const GAME_ID = 5;
const ROUND_SECONDS = 30;
const GRID_SIZE = 9;

function getRandomHole() {
  return Math.floor(
    Math.random() * GRID_SIZE
  );
}

export default function WhackAMolePage() {
  const [activeHole, setActiveHole] =
    useState(getRandomHole);

  const [score, setScore] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(ROUND_SECONDS);

  const [started, setStarted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const scoreRef =
    useRef(score);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const finishRound =
    useCallback(async () => {
      setFinished(true);
      setSubmitting(true);

      try {
        await api.post(
          "/scores",
          {
            game_id: GAME_ID,
            score: scoreRef.current,
          }
        );
      } catch (error) {
        console.error(
          "Failed to submit Whack A Mole score",
          error
        );
      } finally {
        setSubmitting(false);
      }
    }, []);

  useEffect(() => {
    if (
      !started ||
      finished
    ) {
      return;
    }

    const moleTimer =
      setInterval(() => {
        setActiveHole(
          getRandomHole()
        );
      }, 700);

    return () =>
      clearInterval(moleTimer);
  }, [started, finished]);

  useEffect(() => {
    if (
      !started ||
      finished
    ) {
      return;
    }

    const roundTimer =
      setInterval(() => {
        setTimeLeft(current => {
          if (current <= 1) {
            clearInterval(roundTimer);
            finishRound();
            return 0;
          }

          return current - 1;
        });
      }, 1000);

    return () =>
      clearInterval(roundTimer);
  }, [started, finished, finishRound]);

  function startGame() {
    setStarted(true);
    setFinished(false);
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setActiveHole(
      getRandomHole()
    );
  }

  function whack(index) {
    if (!started) {
      startGame();
      return;
    }

    if (
      finished ||
      index !== activeHole
    ) {
      return;
    }

    setScore(current =>
      current + 10
    );

    setActiveHole(
      getRandomHole()
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-3">
        Whack A Mole
      </h1>

      <p className="text-gray-300 mb-6">
        Hit the active target before it moves. Each hit is worth 10 points.
      </p>

      <div className="flex gap-8 text-xl font-semibold mb-6">
        <div>
          Score: {score}
        </div>

        <div>
          Time: {timeLeft}s
        </div>
      </div>

      {!started && (
        <button
          onClick={startGame}
          className="mb-6 rounded bg-green-500 px-6 py-2 font-bold text-black hover:bg-green-400"
        >
          Start Game
        </button>
      )}

      {finished && (
        <div className="mb-6 rounded-lg border border-green-500 bg-gray-800 p-5 text-center">
          <h2 className="text-2xl font-bold text-green-300">
            Round Over
          </h2>

          <p className="mt-2">
            Final Score: {score}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            {submitting ? "Saving score..." : "Score saved"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {Array.from({
          length: GRID_SIZE
        }).map((_, index) => (
          <button
            key={index}
            onClick={() =>
              whack(index)
            }
            className={
              index === activeHole &&
              started &&
              !finished
                ? "h-24 w-24 rounded-full bg-green-400 text-black text-3xl font-bold shadow-lg shadow-green-500/30"
                : "h-24 w-24 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700"
            }
          >
            {index === activeHole &&
            started &&
            !finished
              ? "!"
              : ""}
          </button>
        ))}
      </div>

      {finished && (
        <button
          onClick={startGame}
          className="mt-8 rounded bg-green-500 px-6 py-2 font-bold text-black hover:bg-green-400"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
