// src/components/Navbar.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {

  const { logout } = useAuth();

  return (
    <div className="flex justify-between p-4 border-b">

      <div className="flex gap-4">
        <Link to="/">
            Dashboard
        </Link>

        <Link to="/leaderboard">
            Leaderboard
        </Link>
        <Link to="/games">
            Games
        </Link>
        <Link to="/profile">
          Profile
        </Link>
      </div>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}
