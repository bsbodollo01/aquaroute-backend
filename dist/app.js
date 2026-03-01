"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth/auth.routes")); // <-- your auth routes
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    //origin: "http://localhost:3000", // your frontend URL
    origin: process.env.CLIENT_URL, // your frontend URL
    credentials: true, // if you are sending cookies
}));
app.use(express_1.default.json());
// Routes
app.use("/auth", auth_routes_1.default);
// Test route
app.get("/", (req, res) => {
    res.send("AquaRoute API is working!");
});
exports.default = app;
