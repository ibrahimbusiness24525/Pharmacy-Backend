import { createMedicineType } from "../services/medicineTypeService.js";

export const create = async (req, res) => {
  try {
    const medicineType = await createMedicineType(req.body);

    return res.status(201).json({
      message: "Medicine type created successfully",
      data: medicineType,
    });
  } catch (error) {
    console.error("Create medicine type error:", error);
    return res.status(400).json({
      message: error.message || "Failed to create medicine type",
    });
  }
};

