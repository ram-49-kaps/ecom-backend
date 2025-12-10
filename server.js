// server.js (or index.js)
// Using ES Modules -> "type": "module" in package.json

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { runSQLSetup } from "./utils/runSQLFile.js";
import db from "./config/db.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Base Route
app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

// Routes
app.use("/api/auth", authRoutes);

// Global Error Handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

db.connect((err) => {
  if (err) {
    console.log("DB Connection Failed", err);
  } else {
    console.log("MySQL Connected");
    runSQLSetup(); // AUTO CREATE TABLES
  }
});


// Server Listener
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
