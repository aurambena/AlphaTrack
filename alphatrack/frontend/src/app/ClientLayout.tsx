// app/ClientLayout.tsx
"use client";

import useAutoRefresh from "./hooks/loginAutoRefresh";


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useAutoRefresh(); // 🪄 Keeps the session alive silently

  return <>{children}</>;
}
