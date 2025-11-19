// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const COOKIE_NAME = "token";

// ---------------------------
// JWT Generator
// ---------------------------
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ---------------------------
// SIGNUP (Register Only)
// ---------------------------
export async function signup(req, res, next) {
  
  try {
    const { username, email, password } = req.body;

    console.log("SIGNUP PASSWORD (raw):", JSON.stringify(password));
    console.log("SIGNUP PASSWORD CHAR CODES:", [...password].map(c => c.charCodeAt(0)));

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already in use" });

    const cleanPassword = password.trim();
    const passwordHash = await bcrypt.hash(cleanPassword, 10);

    // after const passwordHash = await bcrypt.hash(cleanPassword, 10);
    const verifyImmediately = await bcrypt.compare(cleanPassword, passwordHash);
    console.log("DEBUG signup: immediate compare =>", verifyImmediately); // should be true
    const user = await User.create({ username, email, passwordHash });

    // Do NOT set cookie on signup
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
}

// ---------------------------
// LOGIN (Authenticate + Cookie)
// ---------------------------
export async function login(req, res, next) {
  console.log("===== LOGIN DEBUG =====");
  console.log("Body received:", req.body);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("User found:", user);

    console.log("LOGIN PASSWORD (raw):", JSON.stringify(password));
    console.log("LOGIN PASSWORD CHAR CODES:", [...password].map(c => c.charCodeAt(0)));
    console.log("STORED HASH:", user.passwordHash);

    
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const cleanPassword = password.trim();

    console.log("DEBUG login: storedHash length", typeof user.passwordHash, user.passwordHash.length);
    const compareAsync = await bcrypt.compare(cleanPassword, user.passwordHash);
    const compareSync = bcrypt.compareSync(cleanPassword, user.passwordHash);
    console.log("DEBUG login: compareAsync =>", compareAsync);
    console.log("DEBUG login: compareSync =>", compareSync);
    // FIXED: Use bcrypt.compare()
    const ok = await bcrypt.compare(cleanPassword, user.passwordHash);
    console.log("Password match:", ok);

    if (!ok)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "None", 
      domain: "onrender.com",
      path: "/"
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
}

// ---------------------------
// LOGOUT
// ---------------------------
export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,
      sameSite: "None", 
      domain: "onrender.com",
    path: "/"
  });

  res.json({ message: "Logged out" });
}

// ---------------------------
// AUTH ME
// ---------------------------
export async function me(req, res) {
  res.json({ user: req.user || null });
}