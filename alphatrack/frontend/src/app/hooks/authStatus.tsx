"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../interceptors/api";

export default function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/api/users/verify", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        setIsLoggedIn(res.data.authenticated === true);
      } catch (err) {
        console.error("Auth error:", err);
        setIsLoggedIn(false);
        // Only redirect if on a protected page
        if (!window.location.pathname.startsWith("/auth"))
          router.push("/auth/login");
      }
    };

    checkUserStatus();
  }, [router]);

  return { isLoggedIn };
}
