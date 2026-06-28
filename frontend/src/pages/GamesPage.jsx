import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const games = [
  {
    name: "Snake",
    description: "Eat food, grow longer, and avoid crashing.",
    path: "/games/snake",
  },
  {
    name: "Memory Match",
    description: "Flip cards and find every matching pair.",
    path: "/games/memory-match",
  },
  {
    name: "Typing Test",
    description: "Type the prompt quickly and accurately.",
    path: "/games/typing-test",
  },
  {
    name: "Tic Tac Toe",
    description: "Play X against the computer and submit winning scores.",
    path: "/games/tic-tac-toe",
  },
  {
    name: "Whack A Mole",
    description: "Hit fast-moving targets before the timer runs out.",
    path: "/games/whack-a-mole",
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold mb-2">
          Games
        </h1>

        <p className="text-gray-400 mb-6">
          Pick a game, play a round, and climb the leaderboards.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {games.map(game => (
            <div
              key={game.name}
              className="rounded-lg border border-gray-800 bg-gray-900 p-5"
            >
              <h2 className="text-xl font-bold mb-2">
                {game.name}
              </h2>

              <p className="text-sm text-gray-400 min-h-16">
                {game.description}
              </p>

              <Link
                to={game.path}
                className="mt-5 inline-block rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-400"
              >
                Play
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
