import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";
import Navbar from "../components/Navbar";

const gameRoutes = {
  Snake: "/games/snake",
  "Memory Match": "/games/memory-match",
  "Typing Test": "/games/typing-test",
  "Tic Tac Toe": "/games/tic-tac-toe",
};

export default function Dashboard() {

  const [user, setUser] =
    useState(null);

  const [games, setGames] =
    useState([]);

  useEffect(() => {

    let isMounted = true;

    async function loadData() {

      try {

        const [
          userResponse,
          gamesResponse
        ] = await Promise.all([
          api.get("/users/me"),
          api.get("/games")
        ]);

        if (isMounted) {
          setUser(
            userResponse.data
          );

          setGames(
            gamesResponse.data
          );
        }

      } catch(error) {

        console.error(error);

      }
    }

    loadData();

    return () => {
      isMounted = false;
    };

  }, []);

  if (!user)
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl p-6">
        <section className="mb-8">
          <p className="text-sm uppercase tracking-wide text-green-300">
            ArcadeHub
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Welcome, {user.username}
          </h1>

          <div className="grid gap-4 sm:grid-cols-2 mt-6">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
              <p className="text-gray-400">
                XP
              </p>

              <p className="text-3xl font-bold">
                {user.xp}
              </p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
              <p className="text-gray-400">
                Level
              </p>

              <p className="text-3xl font-bold">
                {user.level}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold">
              Games
            </h2>

            <Link
              to="/games"
              className="text-green-300 hover:text-green-200"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map(game => {
              const route =
                gameRoutes[game.name];

              return (
                <div
                  key={game.id}
                  className="rounded-lg border border-gray-800 bg-gray-900 p-5"
                >
                  <h3 className="text-xl font-bold">
                    {game.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400 min-h-10">
                    {game.description ||
                      "Play a round and submit your score."}
                  </p>

                  {route ? (
                    <Link
                      to={route}
                      className="mt-5 inline-block rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-400"
                    >
                      Play
                    </Link>
                  ) : (
                    <span className="mt-5 inline-block rounded border border-gray-700 px-4 py-2 text-gray-500">
                      Coming Soon
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
