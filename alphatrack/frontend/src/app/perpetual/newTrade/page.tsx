"use client";
import { useState } from "react";
import axios from "axios";
import { PlatformType, PositionType } from "@/app/enums/tradeEnums";


export default function NewTradeForm() {
  const [form, setForm] = useState({
    pair: "",
    positionType: PositionType.LONG, 
    platformType: PlatformType.CEX,  
    platform: "Binance",
    entryPrice: "",
    exitPrice: "",
    leverage: "",
    openDate: "",
    closeDate: "",
    notes: "",
 });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.post(
      "http://localhost:5000/api/perpetual/addtrade",
      form,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true, // for cookie auth if used
      }
    );

    setMessage(`✅ Trade added successfully!`);
    console.log("Trade saved:", res.data);
  } catch (err: any) {
    console.error("❌ Trade creation error:", err.response?.data || err);
    setMessage(`❌ ${err.response?.data?.message || "Something went wrong"}`);
  }
};


  return (
    <form onSubmit={handleSubmit} className="flex gap-4 w-80 mt-40">
      <div className="flex flex-col p-2 px-1 w-1/2 ">
        <label className="mb-4" htmlFor="pair">Trading Pair</label>
        <input 
        id="pair"
        type="text"
        placeholder="Pair"
        value={form.pair}
        onChange={e => setForm({ ...form, pair: e.target.value })}
        className="border p-2 rounded"
        required
      />
      </div>
      <div className="flex flex-col p-2  w-1/3">
        <label className="mb-4" htmlFor="direction">BUY/SELL</label>
           <select
           id="direction"
           required
           value={form.positionType}
           onChange={(e) =>
           setForm({ ...form, positionType: e.target.value as PositionType })
           }
        >
           <option className="bg-green-500" value="LONG">LONG</option>
           <option  className="bg-red-500" value="SHORT">SHORT</option>
           
           </select>

      </div>

      <div className="flex flex-col p-2  w-1/2" >
        <label className="mb-4" htmlFor="entry">Entry Price</label>
        <input 
          id="entry"
          type="number"
          placeholder="Entry Price"
          value={form.entryPrice}
          onChange={e => setForm({ ...form, entryPrice: e.target.value })}
          className="border p-2 py-3 px-3 rounded"
          required
        />
      </div>
      
      <div className="flex flex-col p-2  w-1/2">
        <label className="mb-4" htmlFor="exit">Exit Price</label>
          <input 
          id="exit"
          type="number"
          placeholder="Exit Price"
          value={form.exitPrice}
          onChange={e => setForm({ ...form, exitPrice: e.target.value })}
          className="border p-2 py-3 px-3 rounded"
          required
        />
      </div>
      
      <div className="flex flex-col p-2  w-1/2">
        <label className="mb-4" htmlFor="leverage">Leverage</label>
        <input 
          id="leverage"
          type="number"
          placeholder="Leverage"
          value={form.leverage}
          onChange={e => setForm({ ...form, leverage: e.target.value })}
          className="border p-2 py-3 px-3 rounded"
          required
        />
      </div>
      <div className="flex flex-col p-2  w-1/2">
        <label className="mb-4" htmlFor="open">Open Date</label>
        <input 
          id="open"
          type="date"
          placeholder="Open Date"
          value={form.openDate}
          onChange={e => setForm({ ...form, openDate: e.target.value })}
          className="border p-2 py-3 px-3 rounded"
          required
        />
      </div>
      <div className="flex flex-col p-2  w-1/2">
        <label className="mb-4" htmlFor="close">Close Date</label>
        <input 
          id="close"
          type="date"
          placeholder="Close Date"
          value={form.closeDate}
          onChange={e => setForm({ ...form, closeDate: e.target.value })}
          className="border p-2 py-3 px-3 rounded"
          required
        />
      </div>
      <div className="flex flex-col p-2">
        <label className="mb-4" htmlFor="notes">Notes</label>
        <input 
          id="notes"
          type="text"
          placeholder="Notes"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          className="border p-2 py-3 px-3 rounded"
            />
      </div>
    
      <button type="submit" className="bg-white text-black  hover:bg-black hover:text-white font-bold px-10 rounded cursor-pointer text-3xl">
        +ADD TRADE
      </button>
    </form>
  );
}
