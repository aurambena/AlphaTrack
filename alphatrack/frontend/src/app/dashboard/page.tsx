"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../interceptors/api"; // your axios instance with interceptor
import Link from "next/link";

interface User {
  _id: string;
  email: string;
  name?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get access token from localStorage (dev mode)
        const token = localStorage.getItem("accessToken");

        // Make request using either Authorization header (dev) or cookies (prod)
        const res = await api.get("http://localhost:5000/api/users/me", {
          headers: token
            ? { Authorization: `Bearer ${token}` } // dev mode
            : {}, // prod will use cookies automatically
          withCredentials: true, // for prod
        });

        setUser(res.data);
      } catch (err: any) {
        console.error("❌ Auth error:", err);
        router.push("/auth/login"); // redirect if not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <>
          <h1 className="text-3xl font-bold m-4">📈 Dashboard</h1>
          <p className="m-4">Welcome, {user.email} {user._id} What do you want to do?</p>
          <section className="m-4">
            <Link className="bg-white text-black  hover:bg-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer text-xl" href="/perpetual">
            Perpetual
          </Link>
          </section>
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
}
