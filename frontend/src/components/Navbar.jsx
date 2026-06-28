import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
  },
  {
    label: "Games",
    path: "/games",
  },
  {
    label: "Leaderboard",
    path: "/leaderboard",
  },
  {
    label: "Profile",
    path: "/profile",
  },
];

export default function Navbar() {

  const { logout } = useAuth();

  return (
    <header className="border-b border-gray-800 bg-gray-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link
          to="/"
          className="font-bold text-green-300"
        >
          ArcadeHub
        </Link>

        <div className="flex items-center gap-4">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-green-300"
                  : "text-gray-300 hover:text-white"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={logout}
          className="rounded border border-gray-700 px-3 py-1 text-gray-300 hover:border-green-400 hover:text-white"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
