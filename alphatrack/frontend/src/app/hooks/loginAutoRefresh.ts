// hooks/useAutoRefresh.ts
"use client";

import { useEffect, useRef } from "react";
import api from "../interceptors/api";

export default function useAutoRefresh() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const isProduction = process.env.NODE_ENV === "production";
        
        if (isProduction) {
          // Production: refresh token is in cookie (automatic)
          await api.post("http://localhost:5000/api/users/refresh");
        } else {
          // Development: get refresh token from localStorage
          const storedRefreshToken = localStorage.getItem("refreshToken");
          
          if (!storedRefreshToken) {
            console.log("⚠️ No refresh token found");
            return;
          }

          const res = await api.post("http://localhost:5000/api/users/refresh", {
            refreshToken: storedRefreshToken
          });

          // Update access token in localStorage
          if (res.data.accessToken) {
            localStorage.setItem("accessToken", res.data.accessToken);
          }
        }
        
        console.log("🔄 Access token refreshed automatically");
      } catch (err) {
        console.error("⚠️ Auto-refresh failed:", err);
        // Optionally redirect to login if refresh fails
        // window.location.href = "/auth/login";
      }
    };

    // Refresh every 14 minutes (before 15-min expiry)
    intervalRef.current = setInterval(refreshToken, 14 * 60 * 1000);

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}