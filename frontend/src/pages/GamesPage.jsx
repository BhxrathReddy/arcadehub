import { Link } from "react-router-dom";

export default function GamesPage() {
  return (
    <div
  className="
    bg-gray-800
    rounded
    p-6
    shadow
  "
>

  <h2>
    Snake
  </h2>

  <p>
    Eat food and survive.
  </p>

  <Link
    to="/games/snake"
  >
    Play
  </Link>

</div>
  );
}