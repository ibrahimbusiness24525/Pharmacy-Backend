import express from "express";
import { create } from "../controllers/medicineTypeController.js";

const router = express.Router();

// POST /api/medicine-type
router.post("/", create);

export default router;

