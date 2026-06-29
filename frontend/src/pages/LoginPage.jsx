import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {

  const { login } =
    useAuth();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();
      setError("");
      setLoading(true);

      try {

        const response =
          await api.post(
            "/auth/login",
            {
              email,
              password
            }
          );

        login(
          response.data.access_token
        );

        navigate("/");

      } catch {

        setError(
          "Invalid email or password."
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-wide text-green-300">
            ArcadeHub
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Welcome back
          </h1>

          <p className="mt-3 text-gray-400">
            Log in to play, submit scores, and climb the leaderboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        >
          {error && (
            <div className="mb-4 rounded border border-red-500 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-gray-300">
              Email
            </span>

            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-green-400"
              required
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-gray-300">
              Password
            </span>

            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-green-400"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded bg-green-500 px-4 py-3 font-bold text-black hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-gray-400">
            New to ArcadeHub?
            {" "}
            <Link
              to="/register"
              className="font-semibold text-green-300 hover:text-green-200"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
