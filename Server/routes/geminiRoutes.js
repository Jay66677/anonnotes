// server/routes/geminiRoutes.js
import express from "express";
import GeminiClient from "../utils/GeminiClient.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();


// Rewrite uploaded text using Gemini
router.post("/rewrite", authRequired, async (req, res) => {
  try {
    const { style, text } = req.body;
    if (!text || !style) {
      return res.status(400).json({ message: "Style and text are required" });
    }

    const rewritten = await GeminiClient.rewriteText(style, text);
    res.json({ rewritten });
  } catch (err) {
    console.error("Rewrite error:", err);
    res.status(500).json({ message: "Rewrite failed" });
  }
});

export default router;
