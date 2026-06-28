import {
  useEffect,
  useState
} from "react";

import api from "../api/api";
import Navbar from "../components/Navbar";

const GLOBAL_TAB = {
  id: "global",
  name: "Global XP",
};

export default function LeaderboardPage() {

  const [games, setGames] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState(GLOBAL_TAB);

  const [players, setPlayers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    let isMounted = true;

    async function loadGames() {
      try {
        const response =
          await api.get("/games");

        if (isMounted) {
          setGames(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadGames();

    return () => {
      isMounted = false;
    };

  }, []);

  useEffect(() => {

    let isMounted = true;

    async function loadLeaderboard() {
      setLoading(true);

      try {
        const endpoint =
          activeTab.id === "global"
            ? "/scores/global"
            : `/scores/leaderboard/${activeTab.id}`;

        const response =
          await api.get(endpoint);

        if (isMounted) {
          setPlayers(response.data);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setPlayers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      isMounted = false;
    };

  }, [activeTab]);

  const tabs = [
    GLOBAL_TAB,
    ...games.map(game => ({
      id: game.id,
      name: game.name,
    }))
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-4xl font-bold mb-2">
          Leaderboards
        </h1>

        <p className="text-gray-400 mb-6">
          Compare global XP or switch to a game-specific ranking.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab)
              }
              className={
                activeTab.id === tab.id
                  ? "rounded bg-green-500 px-4 py-2 font-bold text-black"
                  : "rounded border border-gray-700 px-4 py-2 text-gray-300 hover:border-green-400 hover:text-white"
              }
            >
              {tab.name}
            </button>
          ))}
        </div>

        <section className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-800 px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-300">
            <div>
              Rank
            </div>

            <div className="col-span-2">
              Player
            </div>

            <div className="text-right">
              {activeTab.id === "global"
                ? "XP"
                : "Score"}
            </div>
          </div>

          {loading && (
            <div className="p-6 text-gray-400">
              Loading leaderboard...
            </div>
          )}

          {!loading && players.length === 0 && (
            <div className="p-6 text-gray-400">
              No scores yet.
            </div>
          )}

          {!loading && players.map(player => (
            <div
              key={`${activeTab.id}-${player.rank}-${player.username}`}
              className="grid grid-cols-4 border-t border-gray-800 px-4 py-3"
            >
              <div className="font-bold text-green-300">
                #{player.rank}
              </div>

              <div className="col-span-2">
                <p className="font-semibold">
                  {player.username}
                </p>

                {activeTab.id === "global" && (
                  <p className="text-sm text-gray-500">
                    Level {player.level}
                  </p>
                )}
              </div>

              <div className="text-right font-bold">
                {activeTab.id === "global"
                  ? player.xp
                  : player.score}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
