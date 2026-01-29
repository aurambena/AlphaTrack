"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/interceptors/api"; 

interface Perpetual {
  _id: string; // Add this - MongoDB adds _id to all documents
  user: string;
  pair: string;
  positionType: string; 
  platform: string;
  entryPrice: number;
  exitPrice?: number;
  margin?: number;
  leverage?: number;
  openDate: Date;
  closeDate?: Date;
  pnl?: number;
  duration?: number;
  notes?: string;
}

export default function Stats() {
  const [trades, setTrades] = useState<Perpetual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const res = await api.get(
          "http://localhost:5000/api/perpetual/trades",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
          }
        );
        
        setTrades(res.data);
        setError(null);
      } catch (err: any) {
        console.error("❌ No trades added:", err.response?.data || err);
        setError(err.response?.data?.error || "Failed to fetch trades");
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Loading trades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold m-4">📈 My Stats</h1>
      {trades.length === 0 ? (
        <p className="m-4">No trades found</p>
      ) : (
        <div className="m-4">
          {trades.map((trade) => (
            // ✅ Changed key from trade.user to trade._id
            // Each trade has a unique _id, but multiple trades can have the same user
            <div key={trade._id} className="border p-4 m-2 rounded">
              <p><strong>Pair:</strong> {trade.pair}</p>
              <p><strong>Position:</strong> {trade.positionType}</p>
              <p><strong>Platform:</strong> {trade.platform}</p>
              <p><strong>Entry Price:</strong> ${trade.entryPrice}</p>
              {trade.exitPrice && <p><strong>Exit Price:</strong> ${trade.exitPrice}</p>}
              {trade.pnl && <p><strong>PNL:</strong> ${trade.pnl}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}