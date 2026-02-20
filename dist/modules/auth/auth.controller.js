"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Temporary in-memory user store (for testing)
const users = [];
// Helper to create JWT token
const createToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "supersecretkey", {
        expiresIn: "7d",
    });
};
// REGISTER
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Email, password, and role are required" });
        }
        // Check if user already exists
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Save user to "database"
        const newUser = { id: users.length + 1, email, password: hashedPassword, role };
        users.push(newUser);
        // Create JWT
        const token = createToken({ id: newUser.id, role: newUser.role });
        return res.json({ token, role: newUser.role });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        // Find user
        const user = users.find((u) => u.email === email);
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Compare password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Create JWT
        const token = createToken({ id: user.id, role: user.role });
        return res.json({ token, role: user.role });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
