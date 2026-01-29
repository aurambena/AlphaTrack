"use client";
import { useState } from "react";
import axios from "axios";
import { PlatformType, PositionType } from "@/app/enums/tradeEnums";


export default function NewPlatformForm() {
  const [form, setForm] = useState({
    platform: "",
 });
  const [message, setMessage] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.post(
      "http://localhost:5000/api/perpetual/addplatform",
      form,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true, // for cookie auth if used
      }
    );

    setMessage(`✅ Platform added successfully!`);
    console.log("Trade saved:", res.data);
  } catch (err: any) {
    console.error("❌ Platform creation error:", err.response?.data || err);
    setMessage(`❌ ${err.response?.data?.message || "Something went wrong"}`);
  }
};


  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-80 mt-40">
      <div className="flex flex-col p-2 w-1/2 ">
        <label className="mb-4" htmlFor="platform">Platform</label>
        <input 
        id="platform"
        type="text"
        placeholder="Platform"
        value={form.platform}
        onChange={e => setForm({ ...form, platform: e.target.value })}
        className="border p-2 py-3 px-3 rounded"
        required
      />
      </div>
       
      <button type="submit" className="bg-white text-black  hover:bg-black hover:text-white font-bold rounded cursor-pointer text-xl">
        +ADD PLATFORM
      </button>
    </form>
  );
}
