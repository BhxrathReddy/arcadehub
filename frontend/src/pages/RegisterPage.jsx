import { useState } from "react";
import api from "../api/api";

export default function RegisterPage() {

  const [form, setForm] =
    useState({
      username: "",
      email: "",
      password: ""
    });

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await api.post(
          "/auth/register",
          form
        );

        alert(
          "Registration successful"
        );

      } catch {

        alert(
          "Registration failed"
        );
      }
    };

  return (
    <div className="p-8">

      <h1>
        Register
      </h1>

      <form
        onSubmit={handleSubmit}
      >

        <input
          placeholder="Username"
          onChange={(e)=>
            setForm({
              ...form,
              username:
                e.target.value
            })
          }
        />

        <input
          placeholder="Email"
          onChange={(e)=>
            setForm({
              ...form,
              email:
                e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>
            setForm({
              ...form,
              password:
                e.target.value
            })
          }
        />

        <button>
          Register
        </button>

      </form>
    </div>
  );
}