import { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import GameHeader from "../shared/GameHeader";

const paragraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "React and FastAPI make a powerful full stack combination.",
  "Machine learning allows computers to learn patterns from data and make intelligent decisions.",
  "Consistency and deliberate practice are the keys to becoming a great software engineer."
];

function getRandomParagraph() {
  return paragraphs[
    Math.floor(
      Math.random() *
      paragraphs.length
    )
  ];
}

export default function TypingTestPage() {

  const [text, setText] =
    useState(getRandomParagraph);

  const [input, setInput] =
    useState("");

  const [started, setStarted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [startTime, setStartTime] =
    useState(null);

  const [wpm, setWpm] =
    useState(0);

  const [accuracy, setAccuracy] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [leaderboard, setLeaderboard] =
    useState([]);

  const fetchLeaderboard =
    useCallback(async () => {

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
    }, []);

  useEffect(() => {

    let isMounted = true;

    async function loadLeaderboard() {

      try {

        const response =
          await api.get(
            "/scores/leaderboard/3"
          );

        if (isMounted) {
          setLeaderboard(
            response.data
          );
        }

      } catch (error) {

        console.error(error);

      }
    }

    loadLeaderboard();

    return () => {
      isMounted = false;
    };

  }, []);

  const loadNewParagraph =
    useCallback(() => {

      setText(
        getRandomParagraph()
      );

      setInput("");
      setStarted(false);
      setFinished(false);
      setStartTime(null);
      setWpm(0);
      setAccuracy(0);
      setScore(0);
    }, []);

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

  const calculateAccuracy =
    useCallback((typedText) => {

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
    }, [text]);

  const calculateWPM =
    useCallback(() => {

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
    }, [startTime, text]);

  const finishTest =
    useCallback(async () => {

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
    }, [
      calculateAccuracy,
      calculateWPM,
      fetchLeaderboard,
      input
    ]);

  useEffect(() => {

    if (
      started &&
      !finished &&
      input === text
    ) {

      const timer =
        setTimeout(
          finishTest,
          0
        );

      return () =>
        clearTimeout(timer);

    }

  }, [
    input,
    text,
    started,
    finished,
    finishTest
  ]);

  return (
    <div
      className="
      min-h-screen
      bg-gray-900
      text-white
      p-6
      flex
      flex-col
      items-center
      "
    >
      <GameHeader
        title="Typing Speed Test"
        subtitle="Type the prompt accurately and race for the highest score."
      />

      <div
        className="
        w-full
        max-w-3xl
        bg-gray-800
        p-4
        sm:p-6
        rounded-lg
        mb-6
        text-base
        sm:text-lg
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
