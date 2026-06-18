import { useState, useEffect } from "react";
import api from "../../api/api";

const paragraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "React and FastAPI make a powerful full stack combination.",
  "Machine learning allows computers to learn patterns from data and make intelligent decisions.",
  "Consistency and deliberate practice are the keys to becoming a great software engineer."
];

export default function TypingTestPage() {

  const [text, setText] = useState("");
  const [input, setInput] = useState("");

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [startTime, setStartTime] = useState(null);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [score, setScore] = useState(0);

  const [leaderboard, setLeaderboard] =
    useState([]);

  useEffect(() => {
    loadNewParagraph();
    fetchLeaderboard();
  }, []);

  function loadNewParagraph() {

    const randomText =
      paragraphs[
        Math.floor(
          Math.random() *
          paragraphs.length
        )
      ];

    setText(randomText);
    setInput("");

    setStarted(false);
    setFinished(false);

    setStartTime(null);

    setWpm(0);
    setAccuracy(0);
    setScore(0);
  }

  async function fetchLeaderboard() {

    try {

      const response =
        await api.get(
          "/scores/leaderboard/3"
        );

      setLeaderboard(
        response.data
      );

    } catch (error) {

      console.error(error);

    }
  }

  function handleChange(e) {

    const value =
      e.target.value;

    if (!started) {

      setStarted(true);

      setStartTime(
        Date.now()
      );

    }

    setInput(value);
  }

  useEffect(() => {

    if (
      started &&
      !finished &&
      input === text
    ) {

      finishTest();

    }

  }, [
    input,
    text,
    started,
    finished
  ]);

  function calculateAccuracy(
    typedText
  ) {

    let correct = 0;

    for (
      let i = 0;
      i < typedText.length;
      i++
    ) {

      if (
        typedText[i] ===
        text[i]
      ) {

        correct++;

      }

    }

    return Math.round(
      (
        correct /
        text.length
      ) * 100
    );
  }

  function calculateWPM() {

    const minutes =
      (
        Date.now() -
        startTime
      ) / 60000;

    const words =
      text
        .trim()
        .split(" ")
        .length;

    return Math.max(
      Math.round(
        words / minutes
      ),
      0
    );
  }

  async function finishTest() {

    const finalWPM =
      calculateWPM();

    const finalAccuracy =
      calculateAccuracy(
        input
      );

    const finalScore =
      finalWPM *
      finalAccuracy;

    setWpm(finalWPM);

    setAccuracy(
      finalAccuracy
    );

    setScore(
      finalScore
    );

    setFinished(true);

    try {

      await api.post(
        "/scores",
        {
          game_id: 3,
          score:
            finalScore
        }
      );

      await fetchLeaderboard();

    } catch (error) {

      console.error(error);

    }

  }

  return (
    <div
      className="
      min-h-screen
      bg-gray-900
      text-white
      p-8
      flex
      flex-col
      items-center
      "
    >

      <h1
        className="
        text-4xl
        font-bold
        mb-6
        "
      >
        Typing Speed Test
      </h1>

      <div
        className="
        max-w-3xl
        bg-gray-800
        p-6
        rounded-lg
        mb-6
        text-lg
        leading-relaxed
        "
      >
        {text}
      </div>

      <textarea
        value={input}
        onChange={handleChange}
        disabled={finished}
        placeholder="Start typing..."
        className="
        w-full
        max-w-3xl
        h-40
        bg-gray-800
        rounded-lg
        p-4
        text-lg
        resize-none
        "
      />

      {!finished && started && (

        <div
          className="
          mt-4
          text-gray-300
          "
        >

          Progress:
          {" "}
          {Math.round(
            (
              input.length /
              text.length
            ) * 100
          )}
          %

        </div>

      )}

      {finished && (

        <div
          className="
          mt-8
          bg-gray-800
          border
          border-green-500
          rounded-lg
          p-6
          text-center
          w-full
          max-w-md
          "
        >

          <h2
            className="
            text-3xl
            font-bold
            text-green-400
            mb-4
            "
          >
            Test Complete
          </h2>

          <p>
            WPM:
            {" "}
            {wpm}
          </p>

          <p>
            Accuracy:
            {" "}
            {accuracy}%
          </p>

          <p>
            Score:
            {" "}
            {score}
          </p>

          <button
            onClick={
              loadNewParagraph
            }
            className="
            mt-4
            bg-green-500
            hover:bg-green-400
            text-black
            font-bold
            px-6
            py-2
            rounded
            "
          >
            Play Again
          </button>

        </div>

      )}

      <div
        className="
        mt-10
        w-full
        max-w-md
        "
      >

        <h3
          className="
          text-2xl
          font-bold
          text-yellow-400
          mb-4
          "
        >
          Top Players
        </h3>

        {
          leaderboard
            .slice(0, 10)
            .map(player => (

            <div
              key={
                player.rank
              }
              className="
              flex
              justify-between
              bg-gray-800
              rounded
              px-4
              py-2
              mb-2
              "
            >

              <span>
                #
                {player.rank}
              </span>

              <span>
                {
                  player.username
                }
              </span>

              <span
                className="
                text-green-400
                font-bold
                "
              >
                {
                  player.score
                }
              </span>

            </div>

          ))
        }

      </div>

    </div>
  );
}