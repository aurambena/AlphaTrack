import express from "express";
import Platform from "../models/perpetual/TradingPlatform.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Get all platforms for a user
router.get("/platforms", auth, async (req, res) => {
  const platforms = await Platform.find({ user: req.user.id });
  res.json(platforms);
});

// Add new platform
router.post("/addplatform", auth, async (req, res) => {
  const { name, type } = req.body;
  const platform = new Platform({ user: req.user.id, name, type });
  await platform.save();
  res.status(201).json(platform);
});

export default router;
