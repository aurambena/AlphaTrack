import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//allows to create several routers (GET,POST,PUT,DELETE) with request and export to import inside app.js
const loginRouter = express.Router();

//POST api/users/login
loginRouter.post('/login', async (req, res)=>{
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password')
    
    const accessToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  
  // Save refresh token in DB 
  user.refreshToken = refreshToken;
  await user.save();
   
  const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  //Production: store in cookies
  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
} else {
  //Development: send tokens in JSON
  res
  .header('Authorization', accessToken)
  .json({
    message: "Login successful (dev mode)",
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email },
  });
}

 
});

export default loginRouter;
