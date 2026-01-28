import {
  createMedicinePurchase,
  getAllMedicinePurchases,
  getMedicinePurchaseById,
  updateMedicinePurchase,
  softDeleteMedicinePurchase,
} from "../services/medicinePurchaseService.js";

export const create = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const purchase = await createMedicinePurchase(req.body, userId);
    return res.status(201).json({
      message: "Medicine purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    console.error("Create medicine purchase error:", error);
    return res.status(400).json({
      message: error.message || "Failed to create medicine purchase",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const purchases = await getAllMedicinePurchases(userId);
    return res.status(200).json({
      message: "Medicine purchases retrieved successfully",
      data: purchases,
    });
  } catch (error) {
    console.error("Get medicine purchases error:", error);
    return res.status(500).json({
      message: error.message || "Failed to retrieve medicine purchases",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    const purchase = await getMedicinePurchaseById(id, userId);
    return res.status(200).json({
      message: "Purchase retrieved successfully",
      data: purchase,
    });
  } catch (error) {
    console.error("Get purchase error:", error);
    return res.status(404).json({
      message: error.message || "Purchase not found",
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
    const purchase = await updateMedicinePurchase(id, req.body, userId);
    return res.status(200).json({
      message: "Purchase updated successfully",
      data: purchase,
    });
  } catch (error) {
    console.error("Update purchase error:", error);
    return res.status(400).json({
      message: error.message || "Failed to update purchase",
    });
  }
};

export const softDelete = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    await softDeleteMedicinePurchase(id, userId);
    return res.status(200).json({
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    console.error("Soft delete purchase error:", error);
    return res.status(400).json({
      message: error.message || "Failed to delete purchase",
    });
  }
};
