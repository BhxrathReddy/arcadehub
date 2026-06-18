import { useState, useEffect } from "react";
import api from "../../api/api";

const symbols = [
  "🍎",
  "🚀",
  "🎮",
  "🐍",
  "⚡",
  "🔥"
];

export default function MemoryMatchPage() {

  const [cards, setCards] =
    useState([]);

  const [flipped, setFlipped] =
    useState([]);

  const [matched, setMatched] =
    useState([]);

  const [moves, setMoves] =
    useState(0);

  const [gameOver, setGameOver] =
    useState(false);

  const [startTime, setStartTime] =
    useState(Date.now());

  const [elapsedTime,
    setElapsedTime] =
    useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  function resetGame() {

    const shuffledCards =
      [...symbols, ...symbols]
        .map((symbol, index) => ({
          id: index,
          symbol,
        }))
        .sort(
          () => Math.random() - 0.5
        );

    setCards(shuffledCards);

    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);

    setStartTime(Date.now());
    setElapsedTime(0);
  }

  function flipCard(index) {

    if (
      flipped.includes(index) ||
      matched.includes(index)
    ) {
      return;
    }

    if (flipped.length === 2) {
      return;
    }

    setFlipped((prev) => [
      ...prev,
      index,
    ]);
  }

  useEffect(() => {

    if (flipped.length !== 2) {
      return;
    }

    const [first, second] =
      flipped;

    setMoves(
      (prev) => prev + 1
    );

    if (
      cards[first]?.symbol ===
      cards[second]?.symbol
    ) {

      setMatched((prev) => [
        ...prev,
        first,
        second,
      ]);

      setFlipped([]);

    } else {

      setTimeout(() => {
        setFlipped([]);
      }, 800);

    }

  }, [flipped, cards]);

  useEffect(() => {

    if (
      cards.length > 0 &&
      matched.length === cards.length
    ) {

      finishGame();

    }

  }, [matched, cards]);

  useEffect(() => {

    if (gameOver) return;

    const interval =
      setInterval(() => {

        setElapsedTime(
          Math.floor(
            (Date.now() -
              startTime) / 1000
          )
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, [startTime, gameOver]);

  function calculateScore() {

    return Math.max(
      1000 -
      elapsedTime * 2 -
      moves * 5,
      0
    );

  }

  async function finishGame() {

    const finalScore =
      calculateScore();

    setGameOver(true);

    try {

      await api.post(
        "/scores",
        {
          game_id: 2,
          score: finalScore,
        }
      );

    } catch (error) {

      console.error(error);

    }

  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">

      <h1 className="text-4xl font-bold mb-6">
        Memory Match
      </h1>

      <div className="flex gap-8 mb-6 text-lg">

        <div>
          ⏱ Time:
          {" "}
          {elapsedTime}s
        </div>

        <div>
          🎯 Moves:
          {" "}
          {moves}
        </div>

        <div>
          ⭐ Score:
          {" "}
          {calculateScore()}
        </div>

      </div>

      <div
        className="
          grid
          grid-cols-4
          gap-3
        "
      >

        {cards.map(
          (card, index) => (

          <button
            key={card.id}
            onClick={() =>
              flipCard(index)
            }
            className="
              w-24
              h-24
              rounded-lg
              bg-gray-700
              hover:bg-gray-600
              text-4xl
              transition
            "
          >

            {
              flipped.includes(index) ||
              matched.includes(index)
                ? card.symbol
                : "❓"
            }

          </button>

        ))}

      </div>

      {gameOver && (

        <div
          className="
            mt-8
            bg-gray-800
            border
            border-green-500
            rounded-lg
            p-6
            text-center
          "
        >

          <h2 className="text-3xl font-bold text-green-400 mb-3">
            You Win!
          </h2>

          <p className="mb-2">
            Time:
            {" "}
            {elapsedTime}s
          </p>

          <p className="mb-2">
            Moves:
            {" "}
            {moves}
          </p>

          <p className="mb-4">
            Final Score:
            {" "}
            {calculateScore()}
          </p>

          <button
            onClick={resetGame}
            className="
              bg-green-500
              hover:bg-green-400
              text-black
              font-bold
              px-6
              py-2
              rounded
            "
          >
            Play Again
          </button>

        </div>

      )}

    </div>
  );
}