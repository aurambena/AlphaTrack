import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const refreshRouter = express.Router();

refreshRouter.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
    // Consistent cookie settings
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,    
      sameSite: "none",  
      path: "/",        
      maxAge: 15 * 60 * 60 * 1000,
    });
    return res.json({ message: "Access token refreshed ✅" });
  }else{
    res
  .header('Authorization', newAccessToken)
  .json({
    accessToken: newAccessToken,
    message: "Login successful (dev mode)",
    user: { id: user._id, email: user.email },
  });
  }

    
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

export default refreshRouter;