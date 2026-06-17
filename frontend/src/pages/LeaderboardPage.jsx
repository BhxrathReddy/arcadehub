import {
  useEffect,
  useState
} from "react";

import api from "../api/api";

export default function LeaderboardPage() {

  const [players,
    setPlayers] =
    useState([]);

  useEffect(() => {

    api
      .get("/scores/global")
      .then(res =>
        setPlayers(
          res.data
        )
      );

  }, []);

  return (

    <div
      className="p-8"
    >

      <h1>
        Global Rankings
      </h1>

      {players.map(player => (

        <div
          key={player.rank}
        >

          #{player.rank}
          {" "}
          {player.username}
          {" "}
          XP:
          {" "}
          {player.xp}

        </div>

      ))}

    </div>

  );
}