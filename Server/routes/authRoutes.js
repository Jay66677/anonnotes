// server/routes/authRoutes.js
import express from "express";
import { signup, login, me, logout } from "../controllers/authController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Private routes
router.get("/me", authRequired, me);
router.post("/logout", logout);

export default router;