// server/routes/adminRoutes.js
import express from "express";
import {
  getReports,
  removeNote,
  removeUser,
  adminStats
} from "../controllers/adminController.js";

import {
  authRequired,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Must be authenticated AND admin
router.use(authRequired, adminOnly);

router.get("/reports", getReports);
router.delete("/remove-note/:id", removeNote);
router.delete("/remove-user/:id", removeUser);
router.get("/stats", adminStats);

export default router;
