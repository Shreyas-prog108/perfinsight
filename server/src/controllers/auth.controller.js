import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { validationResult } from "express-validator";
import { ApiError } from "../middleware/error.middleware.js";

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function signup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email: rawEmail, password, role } = req.body;
    const email = String(rawEmail).toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      role: role === "admin" ? "admin" : "hr",
    });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email: rawLoginEmail, password } = req.body;
    const email = String(rawLoginEmail).toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Unauthorized: invalid credentials" });
    }
    const token = signToken(user);
    res.json({
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash").lean();
    if (!user) throw new ApiError(404, "User not found");
    res.json(user);
  } catch (e) {
    next(e);
  }
}
