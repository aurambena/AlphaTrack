import type { Metadata } from "next";
import {  Funnel_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Navbar from "./components/Navbar"; 
import { AuthProvider } from "./context/AuthContext";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "Alpha Track",
  description:
    "It allows traders to log their trades, track performance, and gain insights into their strategies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${funnelDisplay.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar /> 
        <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        
      </body>
    </html>
  );
}
