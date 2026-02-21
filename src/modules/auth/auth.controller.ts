import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Temporary in-memory user store (for testing)
const users: any[] = [];

// Helper to create JWT token
const createToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "supersecretkey", {
    expiresIn: "7d",
  });
};

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Email, password, and role are required" });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { id: users.length + 1, email, password: hashedPassword, role };
    users.push(newUser);

    // Token is still created internally for authMiddleware use
    createToken({ id: newUser.id, role: newUser.role });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Internal token generation for backend use only
    createToken({ id: user.id, role: user.role });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};