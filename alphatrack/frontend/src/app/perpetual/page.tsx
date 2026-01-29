"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../interceptors/api"; 
import Link from "next/link";

interface User {
  _id: string;
  email: string;
  name?: string;
}
export default function Perpetual() {
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
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <>
          <h1 className="text-3xl font-bold m-5">YourData</h1>
          <section className="flex flex-row m-4 gap-10">
            <Link className="bg-white text-black  hover:bg-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer text-xl" href="/perpetual/newTrade">
            Add new trade
          </Link>
          <Link className="bg-white text-black  hover:bg-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer text-xl" href="/perpetual/newPlatform">
            Add new platform
          </Link>
          <Link className="bg-white text-black  hover:bg-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer text-xl" href="/perpetual/stats">
            My Stats
          </Link>
          </section>
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
    </main>
  );
}
