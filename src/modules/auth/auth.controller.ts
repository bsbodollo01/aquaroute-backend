import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

/**
 * Helper to create JWT token
 * In production, ensure JWT_SECRET is set in your Render Environment Variables.
 */
const createToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "supersecretkey", {
    expiresIn: "7d",
  });
};

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // 1. Validation
    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, password, and role are required" 
      });
    }

    // 2. Check if user already exists in Supabase
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user in Database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    // 5. Generate token (optional for register, but helpful for auto-login)
    const token = createToken({ id: newUser.id, role: newUser.role });

    return res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      token // Returning token so the user is logged in immediately
    });

  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during registration" 
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // 2. Find user in Supabase
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // 4. Generate JWT
    const token = createToken({ id: user.id, role: user.role });

    // 5. Return success + token to the frontend
    return res.json({ 
      success: true, 
      message: "Login successful",
      token, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during login" 
    });
  }
};