import express from "express";
import PerpetualTrade from "../models/perpetual/PerpetualTrade.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Get all trades for a user
router.get("/trades", auth, async (req, res) => {
  try {
     console.log("🔍 Fetching trades for user:", req.user.id);
    const trades = await PerpetualTrade.find({ user: req.user.id });
    // .populate("platform");
    console.log(`✅ Found ${trades.length} trades for user ${req.user.id}`);
    res.json(trades);
  } catch (err) {
    console.error("❌ Error fetching trades:", err);
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});

// Add new trade
router.post("/addtrade", auth, async (req, res) => {
   try {
    const {
      pair,
      positionType,
      platform, // should be the _id of a platform
      entryPrice,
      exitPrice,
      leverage,
      openDate,
      closeDate,
      pnl,
      duration,
      notes,
    } = req.body;
  const trade = new PerpetualTrade({
      user: req.user._id,
      pair,
      positionType,
      platform,
      entryPrice,
      exitPrice,
      leverage,
      openDate,
      closeDate,
      pnl,
      duration,
      notes,
    });
  await trade.save();
  res.status(201).json(trade);
   } catch (err) {
    console.error("❌ Error saving trade:", err);
    res.status(500).json({ error: "Failed to create trade" });
  }
});

export default router;
