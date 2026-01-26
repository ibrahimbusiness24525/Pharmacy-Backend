import express from "express";
import {
  create,
  getAll,
  update,
  deleteById,
} from "../controllers/medicineTypeController.js";

const router = express.Router();

// POST /api/medicine-type
router.post("/", create);

// GET /api/medicine-type
router.get("/", getAll);

// PUT /api/medicine-type/:id
router.put("/:id", update);

// DELETE /api/medicine-type/:id
router.delete("/:id", deleteById);

export default router;

