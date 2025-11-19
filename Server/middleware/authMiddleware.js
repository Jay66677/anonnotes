// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const COOKIE_NAME = "token";

// EXTRACT TOKEN ONLY FROM COOKIE
function extractToken(req) {
  return req.cookies?.[COOKIE_NAME] || null;
}

// AUTH REQUIRED → ONLY CHECK COOKIE
export async function authRequired(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message || err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// OPTIONAL AUTH → cookie only
export async function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (user) {
      req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    }
  } catch (err) {
    // ignore invalid token
  }

  next();
}

// ADMIN ONLY
export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}