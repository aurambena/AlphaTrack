"use client";
import { useState } from "react";
import axios from "axios";
import { PlatformType, PositionType } from "@/app/enums/tradeEnums";
import { useRouter } from "next/navigation";



export default function NewTradeForm() {
  const [form, setForm] = useState({
    pair: "",
    positionType: PositionType.LONG, 
    platformType: PlatformType.CEX,  
    platform: "Binance",
    entryPrice: "",
    exitPrice: "",
    margin: "",
    leverage: "",
    openDate: "",
    closeDate: "",
    notes: "",
 });
  // const router = useRouter();
  const [message, setMessage] = useState("");

  const getBgColor = () => {
    if (form.positionType === "LONG") return "bg-green-600 text-white";
    if (form.positionType === "SHORT") return "bg-red-600 text-white";
    return "bg-gray-700 text-white";
  };

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
    // router.push("/dashboard");
    console.log("Trade saved:", res.data);
  } catch (err: any) {
    console.error("❌ Trade creation error:", err.response?.data || err);
    setMessage(`❌ ${err.response?.data?.message || "Something went wrong"}`);
  }
};


  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-80 mt-40">
      <div className="flex flex-col p-2 w-1/2 ">
        <label className="mb-4" htmlFor="pair">Trading Pair</label>
        <input 
        id="pair"
        type="text"
        placeholder="Pair"
        value={form.pair}
        onChange={e => setForm({ ...form, pair: e.target.value })}
        className="border p-2 py-3 px-3 rounded"
        required
      />
      </div>
       <div className="flex flex-col p-2  w-1/2" >
        <label className="mb-4" htmlFor="margin">Margin</label>
        <input 
          id="margin"
          type="number"
          placeholder="Margin"
          value={form.margin}
          onChange={e => setForm({ ...form, margin: e.target.value })}
          className="border p-2 py-3 px-3 rounded"
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
        className={`rounded-md px-4 py-2 appearance-none border border-gray-600 transition-all duration-200 cursor-pointer ${getBgColor()}`}
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
      <div><p>{message}</p></div>
    </form>
    
  );
}
