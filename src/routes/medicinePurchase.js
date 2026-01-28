import express from "express";
import { authenticator } from "../middleware/authenticator.js";
import {
  create,
  getAll,
  getById,
  update,
  softDelete,
} from "../controllers/medicinePurchaseController.js";

const router = express.Router();

router.use(authenticator);

// POST /api/medicine-purchase
router.post("/", create);

// GET /api/medicine-purchase
router.get("/", getAll);

// GET /api/medicine-purchase/:id
router.get("/:id", getById);

// PUT /api/medicine-purchase/:id
router.put("/:id", update);

// DELETE /api/medicine-purchase/:id (soft delete)
router.delete("/:id", softDelete);

export default router;
