import { Link } from "react-router-dom";

export default function GamesPage() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold">
        Games
      </h1>

      <Link to="/games/snake">
        Play Snake
      </Link>

    </div>
  );
}