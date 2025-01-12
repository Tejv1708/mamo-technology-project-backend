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
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
