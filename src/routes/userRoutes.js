import express from "express";
import { createUser, login, protect } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);

export default router;
