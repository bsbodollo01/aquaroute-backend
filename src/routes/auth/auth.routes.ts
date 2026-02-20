import { Router } from "express";
import { register, login } from "../../modules/auth/auth.controller";

const router = Router();

/**
 * @route POST /auth/register
 * @desc Register a new user (Buyer or Seller)
 * Body: { email, password, role: "BUYER" | "SELLER" }
 */
router.post("/register", register);

/**
 * @route POST /auth/login
 * @desc Login user
 * Body: { email, password }
 */
router.post("/login", login);

export default router;
