"use client";
import { useState } from "react";
import axios from "axios";

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", form);
      setMessage(`✅ User created: ${res.data.user.email}`);
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.message || "Something went wrong"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80 m-auto mt-20">
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="border p-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Sign up
      </button>
      <p>{message}</p>
    </form>
  );
}
