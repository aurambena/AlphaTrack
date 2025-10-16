"use client";
import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/users/login", form, {
      withCredentials: true,
    });

    if (process.env.NODE_ENV === "development") {
      // 💾 Store tokens locally for dev
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }

    const { user, message } = res.data;
    setMessage(`✅ ${message} — ${user.email}`);
  } catch {
    setMessage(`❌ "Something went wrong"}`);
  }
};


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80 m-auto mt-20">
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
        Sign in
      </button>
      <p>{message}</p>
    </form>
  );
}

// "use client";
// import { useState } from "react";
// import axios from "axios";

// export default function TestAuth() {
//   const [message, setMessage] = useState("");

//   const handleCheck = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/me", {
//         withCredentials: true,
//       });
//       setMessage(`✅ Authenticated as: ${res.data.user.email}`);
//     } catch (err: any) {
//       setMessage(`❌ ${err.response?.data || "Not authenticated"}`);
//     }
//   };

//   return (
//     <div className="text-center mt-10">
//       <button
//         onClick={handleCheck}
//         className="bg-green-600 text-white px-4 py-2 rounded"
//       >
//         Test Authentication
//       </button>
//       <p className="mt-4">{message}</p>
//     </div>
//   );
// }
