import { useState } from "react";
import api from "../../api/api";
import GameHeader from "../shared/GameHeader";

const GAME_ID = 4;
const EMPTY_BOARD = Array(9).fill(null);
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}

function getComputerMove(board) {
  const openSquares =
    board
      .map((value, index) =>
        value ? null : index
      )
      .filter(index =>
        index !== null
      );

  if (openSquares.length === 0) {
    return null;
  }

  return openSquares[
    Math.floor(
      Math.random() *
      openSquares.length
    )
  ];
}

export default function TicTacToePage() {
  const [board, setBoard] =
    useState(EMPTY_BOARD);

  const [status, setStatus] =
    useState("Your turn");

  const [finished, setFinished] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  async function submitScore(score) {
    setSubmitting(true);

    try {
      await api.post(
        "/scores",
        {
          game_id: GAME_ID,
          score,
        }
      );
    } catch (error) {
      console.error(
        "Failed to submit Tic Tac Toe score",
        error
      );
    } finally {
      setSubmitting(false);
    }
  }

  function finishGame(
    message,
    score
  ) {
    setStatus(message);
    setFinished(true);

    if (score > 0) {
      submitScore(score);
    }
  }

  function handleMove(index) {
    if (
      board[index] ||
      finished
    ) {
      return;
    }

    const playerBoard = [
      ...board
    ];

    playerBoard[index] = "X";

    const playerWinner =
      getWinner(playerBoard);

    if (playerWinner) {
      setBoard(playerBoard);
      finishGame(
        "You win!",
        100
      );
      return;
    }

    if (
      playerBoard.every(Boolean)
    ) {
      setBoard(playerBoard);
      finishGame(
        "Draw game",
        25
      );
      return;
    }

    const computerIndex =
      getComputerMove(playerBoard);

    if (computerIndex !== null) {
      playerBoard[computerIndex] = "O";
    }

    const computerWinner =
      getWinner(playerBoard);

    setBoard(playerBoard);

    if (computerWinner) {
      finishGame(
        "Computer wins",
        0
      );
      return;
    }

    if (
      playerBoard.every(Boolean)
    ) {
      finishGame(
        "Draw game",
        25
      );
      return;
    }

    setStatus("Your turn");
  }

  function resetGame() {
    setBoard(EMPTY_BOARD);
    setStatus("Your turn");
    setFinished(false);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <GameHeader
        title="Tic Tac Toe"
        subtitle="You are X. Beat the computer to earn 100 points."
      />

      <div className="text-xl font-semibold mb-5">
        {submitting ? "Saving score..." : status}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 w-full max-w-xs">
        {board.map((square, index) => (
          <button
            key={index}
            onClick={() =>
              handleMove(index)
            }
            className="
              aspect-square
              rounded-lg
              bg-gray-800
              border
              border-gray-700
              text-4xl
              sm:text-5xl
              font-bold
              hover:bg-gray-700
              disabled:hover:bg-gray-800
            "
            disabled={
              Boolean(square) ||
              finished
            }
          >
            {square}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded"
      >
        New Game
      </button>
    </div>
  );
}
