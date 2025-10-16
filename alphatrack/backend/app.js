import 'dotenv/config';
import mongoose from 'mongoose'; //mapeo relacional ODM Object Document Map, allows to connect with the DB
import express from "express";
import cors from "cors";
import signupRouter from './auth/signUp.js';
import loginRouter from './auth/login.js';
import error from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import userRouters from './routes/userRoutes.js'

//Create an app 
const app = express();

const DB_URL = 
//prevent to delete production DB
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27017/alphatrack-db-test"
    : process.env.DB_URL || "mongodb://localhost:27017/alphatrack-db";

//Create conection to MongoDB
//To pass our DB URL
mongoose.connect(DB_URL)
  .then(()=>console.log(`Connected to DB: ${DB_URL}`))
  .catch((err) => console.error('Failed conection to MongoDB', err))

//Use some middlewares
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));


if(process.env.NODE_ENV === 'prod'){
  app.use(compression());
  app.use(rateLimit());
}

//Create our first route
app.get("/hello", (req, res) => {
  res.json({ message: "Backend is connected ✅" });
});

signupRouter.get("/test", (req, res) => {
  res.send("✅ Signup router is working");
});


//sort the routes
app.use("/api/users", signupRouter);
app.use("/api/users", loginRouter);
app.use("/api/users", userRouters);
app.use(error);

export default app
