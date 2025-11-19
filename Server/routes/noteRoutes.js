// server/routes/noteRoutes.js
import express from "express";
import {
  createNote,
  getAllNotes,
  getMostLiked,
  getMostRecent,
  toggleLike,
  getMyNotes,
  reportNote,
  detectMood
} from "../controllers/noteController.js";

import { addComment, getComments } from "../controllers/commentController.js";

import {
  authRequired,
  optionalAuth
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id/comments", getComments);
router.post("/:id/comments", authRequired, addComment);


// Public browsing allowed
router.get("/", optionalAuth, getAllNotes);
router.get("/most-liked", optionalAuth, getMostLiked);
router.get("/most-recent", optionalAuth, getMostRecent);

// Requires login
router.post("/", authRequired, createNote);
router.post("/:id/like", authRequired, toggleLike);
router.post("/:id/report", authRequired, reportNote);
router.post("/:id/mood", authRequired, detectMood);
router.get("/mine", authRequired, getMyNotes);



export default router;
