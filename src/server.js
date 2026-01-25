import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import medicineTypeRoutes from "./routes/medicineType.js";

// Load env vars
dotenv.config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
});

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medicine-type", medicineTypeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Pharmacy Backend API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
