import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createSlot,
  deleteMeeting,
  getAllMeeting,
  updateMeeting,
} from "../controllers/timeslotController.js";

const router = express.Router();

router.get("/allMeeting/", protect, getAllMeeting);
router.post("/createSlot/:id", protect, createSlot);
router.delete("/deleteSlot/:id", protect, deleteMeeting);
router.put("/updateSlot/:id", protect, updateMeeting);

export default router;
