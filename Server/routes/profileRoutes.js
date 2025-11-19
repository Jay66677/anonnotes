// server/routes/profileRoutes.js
import express from "express";
import { getProfile, toggleSave } from "../controllers/profileController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Profile info: username, email, stats, liked & saved notes
router.get("/", authRequired, getProfile);

// Save / Bookmark toggle
router.post("/save/:id", authRequired, toggleSave);

export default router;
