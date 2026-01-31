import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const refreshRouter = express.Router();

refreshRouter.post('/refresh', async (req, res) => {
  try{
  // Get refresh token from cookie or body
    const isProduction = process.env.NODE_ENV === "production";
    const refreshToken = isProduction 
      ? req.cookies.refreshToken 
      : req.body.refreshToken; // Dev mode sends in body

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    // Verify the JWT is valid
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user by ID from decoded token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Compare the refresh token with hashed one in DB    
  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

  if (!isValid) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  //Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Send response based on environment
    if (isProduction) {
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,    
        sameSite: "none",  
        path: "/",        
        maxAge: 15 * 60 * 1000, //  15 minutes
      });
      return res.json({ message: "Access token refreshed" });
    } else {
      // Development mode
      res.json({
        accessToken: newAccessToken,
        message: "Access token refreshed (dev mode)",
      });
    }

  } catch (err) {
    console.error("❌ Refresh token error:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

export default refreshRouter;
