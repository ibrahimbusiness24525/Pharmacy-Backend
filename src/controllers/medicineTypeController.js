import {
  createMedicineType,
  getAllMedicineTypes,
  updateMedicineType,
  deleteMedicineType,
} from "../services/medicineTypeService.js";

export const create = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const medicineType = await createMedicineType(req.body, userId);

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

export const getAll = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const medicineTypes = await getAllMedicineTypes(userId);

    return res.status(200).json({
      message: "Medicine types retrieved successfully",
      data: medicineTypes,
    });
  } catch (error) {
    console.error("Get medicine types error:", error);
    return res.status(500).json({
      message: error.message || "Failed to retrieve medicine types",
    });
  }
};


export const update = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    const medicineType = await updateMedicineType(id, req.body, userId);

    return res.status(200).json({
      message: "Medicine type updated successfully",
      data: medicineType,
    });
  } catch (error) {
    console.error("Update medicine type error:", error);
    return res.status(400).json({
      message: error.message || "Failed to update medicine type",
    });
  }
};

export const deleteById = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    await deleteMedicineType(id, userId);

    return res.status(200).json({
      message: "Medicine type deleted successfully",
    });
  } catch (error) {
    console.error("Delete medicine type error:", error);
    return res.status(400).json({
      message: error.message || "Failed to delete medicine type",
    });
  }
};
