import { useState, useEffect } from "react";
import api from "../../api/api";
import GameHeader from "../shared/GameHeader";

const symbols = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F"
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

    if (flipped.length === 0) {
      setFlipped([index]);
      return;
    }

    const first =
      flipped[0];

    const nextMoves =
      moves + 1;

    setMoves(
      nextMoves
    );

    if (
      cards[first]?.symbol ===
      cards[index]?.symbol
    ) {

      const nextMatched = [
        ...matched,
        first,
        index,
      ];

      setMatched((prev) => [
        ...prev,
        first,
        index,
      ]);

      setFlipped([]);

      if (nextMatched.length === cards.length) {
        finishGame(
          calculateScore(nextMoves)
        );
      }

    } else {

      setFlipped([
        first,
        index,
      ]);

      setTimeout(() => {
        setFlipped([]);
      }, 800);

    }
  }

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

  function calculateScore(
    moveCount = moves
  ) {

    return Math.max(
      1000 -
      elapsedTime * 2 -
      moveCount * 5,
      0
    );

  }

  async function finishGame(
    finalScore
  ) {

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">

      <GameHeader
        title="Memory Match"
        subtitle="Flip cards, find pairs, and finish with as few moves as possible."
      />

      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6 text-lg">

        <div>
          Time:
          {" "}
          {elapsedTime}s
        </div>

        <div>
          Moves:
          {" "}
          {moves}
        </div>

        <div>
          Score:
          {" "}
          {calculateScore()}
        </div>

      </div>

      <div
          className="
            grid
            grid-cols-4
            gap-2
            sm:gap-3
            w-full
            max-w-md
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
              aspect-square
              rounded-lg
              bg-gray-700
              hover:bg-gray-600
              text-3xl
              sm:text-4xl
              transition
            "
          >

            {
              flipped.includes(index) ||
              matched.includes(index)
                ? card.symbol
                : "?"
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
