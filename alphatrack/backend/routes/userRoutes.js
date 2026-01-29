import express from "express";
import auth from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Protected route
router.get("/me", auth, async (req, res) => {
  try {
    console.log("🔍 req.user:", req.user);
    console.log("🔍 Looking for user with _id:", req.user.id);
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});


//Check if user is authenticated (for frontend)
router.get("/verify", auth, (req, res) => {
  res.json({ authenticated: true });
});

export default router;



