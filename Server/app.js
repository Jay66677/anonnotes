// server/app.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


console.log("JWT:", process.env.JWT_SECRET);
console.log("GEMINI:", process.env.GEMINI_API_KEY);
console.log("CLOUD:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("--------------------------------");


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";




// Initialize DB connection
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: "https://grand-moxie-6f3b89.netlify.app",  // frontend          
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"]
}));


app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", geminiRoutes);
app.use("/api/upload", uploadRoutes);

// Health Check (for testing server)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend running" });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AnonNotes API running on port ${PORT}`);
});
