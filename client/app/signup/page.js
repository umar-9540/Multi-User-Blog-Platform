"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      login(data.token, { name: data.name, role: data.role, _id: data._id });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto card mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 p-2 mb-4 rounded text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-gray-400">Full Name</label>
          <input
            className="input"
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-400">
            Email Address
          </label>
          <input
            className="input"
            type="email"
            placeholder="john@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-400">Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn w-full bg-green-600 hover:bg-green-500">
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center text-gray-400 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
