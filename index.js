import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/dbConfig.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Started on ${port}`);
});
