import { useEffect, useState } from "react";
import api from "../api/api";

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
          api.get("/users/achievements")
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
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            Loading Profile...
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

  return (

    <div className="min-h-screen bg-gray-900 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Profile
      </h1>

      <div className="bg-gray-800 rounded-xl p-6 mb-8">

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
          </div>

          <div>

            <h2 className="text-2xl font-bold">
              {profile.username}
            </h2>

            <p>
              {profile.email}
            </p>

            <p>
              Level {profile.level}
            </p>

          </div>

        </div>

        <div className="mt-6">

          <p>
            XP:
            {" "}
            {profile.xp}
            {" / "}
            {xpNeeded}
          </p>

          <div className="w-full bg-gray-700 rounded h-4 mt-2">

            <div
              className="bg-green-500 h-4 rounded"
              style={{
                width: `${progress}%`
              }}
            />

          </div>

        </div>

      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Statistics
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <div>
            Games Played:
            {" "}
            {profile.games_played}
          </div>

          <div>
            Highest Score:
            {" "}
            {profile.highest_score}
          </div>

        </div>

      </div>

      <div className="bg-gray-800 rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          Achievements
        </h2>

        <div className="grid grid-cols-3 gap-4">

          {achievements.map(
            achievement => (

            <div
              key={achievement.id}
              className="
                bg-gray-700
                rounded-lg
                p-4
              "
            >

              <div className="text-sm uppercase tracking-wide text-green-300 mb-2">
                Award
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

      </div>

    </div>

  );

}
