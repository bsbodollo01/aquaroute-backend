"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../modules/auth/auth.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/register
 * @desc Register a new user (Buyer or Seller)
 * Body: { email, password, role: "BUYER" | "SELLER" }
 */
router.post("/register", auth_controller_1.register);
/**
 * @route POST /auth/login
 * @desc Login user
 * Body: { email, password }
 */
router.post("/login", auth_controller_1.login);
exports.default = router;
