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
  <Link
    to="/games/memory-match"
    className="block"
  >
    Play Memory Match
  </Link>
  <Link
    to="/games/typing-test"
    className="block"
  >
    Play Typing Test
  </Link>

</div>

  );
}