import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function ProfilePage() {

  const [profile, setProfile] =
    useState(null);

  const [achievements,
    setAchievements] =
    useState([]);

  useEffect(() => {

    let isMounted = true;

    async function loadProfile() {

      try {

        const [
          profileResponse,
          achievementResponse
        ] = await Promise.all([
          api.get("/users/profile"),
          api.get("/users/achievements/all")
        ]);

        if (isMounted) {
          setProfile(
            profileResponse.data
          );

          setAchievements(
            achievementResponse.data
          );
        }

      } catch(error) {

        console.error(error);

      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };

  }, []);

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading profile...
      </div>
    );

  const xpNeeded =
    profile.level * 100;

  const progress =
    Math.min(
      (profile.xp / xpNeeded) *
      100,
      100
    );

  const unlockedCount =
    achievements.filter(
      achievement => achievement.unlocked
    ).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-4xl font-bold mb-8">
          Profile
        </h1>

        <section className="rounded-lg border border-gray-800 bg-gray-900 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-green-500
                flex
                items-center
                justify-center
                text-3xl
                font-bold
                text-black
              "
            >
              {profile.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {profile.username}
              </h2>

              <p className="text-gray-400">
                {profile.email}
              </p>

              <p className="text-green-300">
                Level {profile.level}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-300">
              <span>
                XP
              </span>

              <span>
                {profile.xp} / {xpNeeded}
              </span>
            </div>

            <div className="w-full bg-gray-800 rounded h-4 mt-2">
              <div
                className="bg-green-500 h-4 rounded"
                style={{
                  width: `${progress}%`
                }}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <p className="text-gray-400">
              Games Played
            </p>

            <p className="text-3xl font-bold">
              {profile.games_played}
            </p>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <p className="text-gray-400">
              Highest Score
            </p>

            <p className="text-3xl font-bold">
              {profile.highest_score}
            </p>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <p className="text-gray-400">
              Achievements
            </p>

            <p className="text-3xl font-bold">
              {unlockedCount} / {achievements.length}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-2xl font-bold mb-4">
            Achievements
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map(
              achievement => (

              <div
                key={achievement.id}
                className={
                  achievement.unlocked
                    ? "rounded-lg bg-gray-800 p-4 border border-green-500"
                    : "rounded-lg bg-gray-800 p-4 border border-gray-700 opacity-60"
                }
              >
                <div
                  className={
                    achievement.unlocked
                      ? "text-sm uppercase tracking-wide text-green-300 mb-2"
                      : "text-sm uppercase tracking-wide text-gray-500 mb-2"
                  }
                >
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </div>

                <h3 className="font-bold">
                  {achievement.name}
                </h3>

                <p className="text-sm text-gray-300">
                  {achievement.description}
                </p>
              </div>

            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
