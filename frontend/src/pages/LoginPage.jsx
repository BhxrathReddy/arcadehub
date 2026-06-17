import { useState } from "react";
import api from "../api/api";

import { useAuth }
from "../context/AuthContext";

export default function LoginPage() {

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

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

      } catch {

        alert(
          "Login failed"
        );
      }
    };

  return (
    <div className="p-8">

      <h1>
        Login
      </h1>

      <form
        onSubmit={handleSubmit}
      >

        <input
          placeholder="Email"
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
        />

        <button>
          Login
        </button>

      </form>

    </div>
  );
}