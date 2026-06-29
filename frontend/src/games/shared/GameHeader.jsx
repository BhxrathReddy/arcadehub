import { Link } from "react-router-dom";

export default function GameHeader({
  title,
  subtitle
}) {
  return (
    <div className="mb-6 w-full max-w-4xl">
      <Link
        to="/games"
        className="text-sm font-semibold text-green-300 hover:text-green-200"
      >
        Back to Games
      </Link>

      <h1 className="mt-4 text-4xl font-bold">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}
