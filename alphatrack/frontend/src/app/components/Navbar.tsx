"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); 

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (process.env.NODE_ENV === "development") {
          const token = localStorage.getItem("accessToken");
          setIsLoggedIn(!!token);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/verify`, {
          credentials: "include",
        });
        setIsLoggedIn(res.ok);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    verifySession();
  }, []);

  const handleLogout = async () => {
    if (process.env.NODE_ENV === "development") {
      localStorage.removeItem("accessToken");
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    }
    window.location.href = "/";
  };
  if (isLoggedIn === null) return null; 
  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-md shadow-white/10 z-50">
      <div className="flex justify-between items-center text-xl p-6">
        <div>
          <Link className="text-3xl font-bold" href="/">
            ALPHA TRACK
          </Link>
        </div>
        <div className="flex gap-8">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:bg-white hover:text-black font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="hover:bg-white hover:text-black font-bold py-2 px-4 rounded"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                className="hover:bg-white hover:text-black font-bold py-2 px-4 rounded"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] animate-pulse"></div>
    </nav>
  );
}
