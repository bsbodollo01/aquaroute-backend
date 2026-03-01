import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/auth.routes"; // <-- your auth routes

const app = express();

// Middleware
app.use(cors({
  //origin: "http://localhost:3000", // your frontend URL
  origin: process.env.CLIENT_URL, // your frontend URL
  credentials: true, // if you are sending cookies
}));

app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AquaRoute API is working!");
});

export default app;
