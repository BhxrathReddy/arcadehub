import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";

export default function RegisterPage() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      username: "",
      email: "",
      password: ""
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const updateField =
    (field, value) => {
      setForm({
        ...form,
        [field]: value
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();
      setError("");
      setSuccess("");
      setLoading(true);

      try {

        await api.post(
          "/auth/register",
          form
        );

        setSuccess(
          "Account created. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 800);

      } catch {

        setError(
          "Registration failed. Try a different email or username."
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
            Create account
          </h1>

          <p className="mt-3 text-gray-400">
            Join the arcade, save your scores, and start unlocking achievements.
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

          {success && (
            <div className="mb-4 rounded border border-green-500 bg-green-950/40 px-4 py-3 text-sm text-green-200">
              {success}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-gray-300">
              Username
            </span>

            <input
              value={form.username}
              placeholder="arcadeplayer"
              onChange={(e) =>
                updateField(
                  "username",
                  e.target.value
                )
              }
              className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-green-400"
              required
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-gray-300">
              Email
            </span>

            <input
              type="email"
              value={form.email}
              placeholder="you@example.com"
              onChange={(e) =>
                updateField(
                  "email",
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
              value={form.password}
              placeholder="Choose a password"
              onChange={(e) =>
                updateField(
                  "password",
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
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account?
            {" "}
            <Link
              to="/login"
              className="font-semibold text-green-300 hover:text-green-200"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
