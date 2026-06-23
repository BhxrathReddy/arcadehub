import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";
import Navbar from "../components/Navbar";

const gameRoutes = {
  Snake: "/games/snake",
  "Memory Match": "/games/memory-match",
  "Typing Test": "/games/typing-test",
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
    return <h2>Loading...</h2>;

  return (
    <>
    <Navbar />
    
      <div className="p-8">

        <h1 className="text-3xl font-bold">
          Welcome {user.username}
        </h1>

        <p>
          XP: {user.xp}
        </p>

        <p>
          Level: {user.level}
        </p>

        <h2 className="mt-8 text-2xl">
          Games
        </h2>

        <div
  className="
  grid
  grid-cols-3
  gap-4
  mt-4
  "
>

{games.map(game => (

  <div
    key={game.id}
    className="
    border
    rounded
    p-4
    shadow
    "
  >

    <h3
      className="font-bold"
    >
      {game.name}
    </h3>

    {gameRoutes[game.name] && (
      <Link
        to={gameRoutes[game.name]}
        className="
        inline-block
        mt-3
        border
        px-3
        py-1
        "
      >
        Play
      </Link>
    )}

  </div>

))}

</div>

      </div>
    </>
  );
}
