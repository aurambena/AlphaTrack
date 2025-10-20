// hooks/useAutoRefresh.ts
"use client";

import { useEffect } from "react";
import api from "../interceptors/api";

export default function useAutoRefresh() {
  useEffect(() => {
    // refresh every 14 minutes (slightly before the 15-min expiry)
    const interval = setInterval(async () => {
      try {
        await api.post("/users/refresh");
        console.log("🔄 Access token refreshed automatically");
      } catch (err) {
        console.error("⚠️ Auto-refresh failed:", err);
      }
    }, 14 * 60 * 1000); // 14 min

    // clean up when user leaves page
    return () => clearInterval(interval);
  }, []);
}
