"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { setIsLoggedIn } = useAuth();


  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/users/login", form, {
      withCredentials: true,
    });

    if (process.env.NODE_ENV === "development") {
      // Store tokens locally for dev
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      setIsLoggedIn(true);
    }

    const { user, message } = res.data;
    setMessage(`✅ ${message} — ${user.email}`);
    router.push("/dashboard");

  } catch {
    setMessage(`❌ "Something went wrong"}`);
  }
};


  return (
    <div>
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80 mt-40 m-auto">
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="border p-2 py-3 px-3 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        className="border p-2 py-3 px-3 rounded"
      />
      <button type="submit" className="bg-white text-black  hover:bg-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer text-xl">
        Sign in
      </button>
      <p>{message}</p>
    </form>
    </div>
  );
}

