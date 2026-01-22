import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../utils/mailer.js";

const router = express.Router();

function generateOtp() {
  // 6-digit numeric OTP
  return String(Math.floor(100000 + Math.random() * 900000));
}

function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

// Signup: email + password + confirmPassword -> email OTP -> verify OTP creates account
// POST /api/auth/signup/request-otp
router.post("/signup/request-otp", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(String(password), 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.findOneAndUpdate(
      { email: normalizedEmail, purpose: "signup" },
      {
        email: normalizedEmail,
        purpose: "signup",
        otpHash,
        expiresAt,
        name,
        passwordHash,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail({ to: normalizedEmail, otp });

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Signup request-otp error:", err);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({ message: err?.message || "Server error" });
    }

    const message =
      err?.message === "Email service is not configured"
        ? "Email service is not configured"
        : "Server error";
    return res.status(500).json({ message });
  }
});

// POST /api/auth/signup/verify-otp
router.post("/signup/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const otpDoc = await Otp.findOne({
      email: normalizedEmail,
      purpose: "signup",
    });
    if (!otpDoc) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new OTP." });
    }

    if (otpDoc.expiresAt.getTime() < Date.now()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(String(otp), otpDoc.otpHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(409).json({ message: "Email already registered" });
    }

    if (!otpDoc.passwordHash) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res
        .status(400)
        .json({ message: "Signup data missing. Please sign up again." });
    }

    const user = await User.create({
      name: otpDoc.name || "User",
      email: normalizedEmail,
      password: otpDoc.passwordHash,
    });

    await Otp.deleteOne({ _id: otpDoc._id });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup verify-otp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login: email + password
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.json({
      message: "Logged in successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
