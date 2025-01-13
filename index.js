import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./src/routes/userRoutes.js";
import timeRoutes from "./src/routes/timesRoutes.js";

dotenv.config("./env");

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5174",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5174");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api/user", userRouter);
app.use("/api/time", timeRoutes);

app.listen(3000, () => {
  console.log("Connected to Port 3000");
});

mongoose
  .connect(process.env.mongo_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB error", err);
  });
