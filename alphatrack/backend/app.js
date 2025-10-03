import 'dotenv/config';
import mongoose from 'mongoose'; //mapeo relacional ODM Object Document Map, allows to connect with the DB
import express from "express";
import cors from "cors";


//Create an app 
const app = express();

const DB_URL = 
//prevent to delete production DB
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27017/tickets-db-test"
    : process.env.DB_URL || "mongodb://localhost:27017/tickets-db";

//Create conection to MongoDB
//To pass our DB URL
mongoose.connect(DB_URL)
  .then(()=>console.log(`Connected to DB: ${DB_URL}`))
  .catch((err) => console.error('Failed conection to MongoDB', err))

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

//Use some middlewares
app.use(express.json());

//Create our first route
app.get("/hello", (req, res) => {
  res.json({ message: "Backend is connected ✅" });
});

export default app
