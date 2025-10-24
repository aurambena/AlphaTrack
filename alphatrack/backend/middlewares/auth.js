import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  //Try to get token from cookies (production)
  let token = req.cookies?.accessToken;

  // If not found, try from Authorization header (development)
  if (!token && req.headers.authorization) {
    token = req.header("Authorization").replace("Bearer ", ""); 
  }
  if (!token) return res.status(401).send("Access denied. No token provided");

  try{
        //this function verity the token and return the decoded token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified;
        //pass to next middleware
        next();
    }catch(error){
        res.status(400).send('Invalid token')
    }
}

