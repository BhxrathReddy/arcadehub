import { useEffect, useState } from "react";

import api from "../api/api";
import Navbar from "../components/Navbar";
export default function Dashboard() {

  const [user, setUser] =
    useState(null);

  const [games, setGames] =
    useState([]);

  useEffect(() => {

    fetchData();

  }, []);

  async function fetchData() {

    try {

      const userResponse =
        await api.get(
          "/users/me"
        );

      const gamesResponse =
        await api.get(
          "/games"
        );

      setUser(
        userResponse.data
      );

      setGames(
        gamesResponse.data
      );

    } catch(error) {

      console.error(error);

    }
  }

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

    <button
      className="
      mt-3
      border
      px-3
      py-1
      "
    >
      Play
    </button>

  </div>

))}

</div>

      </div>
    </>
  );
}