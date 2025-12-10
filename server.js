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
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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

db.query("SELECT 1", (err) => {
  if (err) {
    console.log("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected (Pool)");

    // Only run SQL setup in development
    if (process.env.NODE_ENV !== "production") {
      runSQLSetup();
    }
  }
});



// Server Listener
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
