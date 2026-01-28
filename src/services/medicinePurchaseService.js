import MedicinePurchase from "../models/MedicinePurchase.js";
import MedicineType from "../models/MedicineType.js";

export const createMedicinePurchase = async (data, userId) => {
  const {
    paymentType,
    supplierName,
    supplierNumber,
    medicineType,
    expiryDate,
    quantityType,
    boxQuantity,
    piecesPerBox,
    boxPrice,
    stripsQuantity,
    piecesPerStrip,
    stripPrice,
    totalQuantity,
    perPiecePrice: perPiecePriceInput,
  } = data;

  if (!paymentType || !medicineType) {
    throw new Error("Payment type and medicine type are required");
  }

  if (!["credit", "full_payment"].includes(paymentType)) {
    throw new Error("Payment type must be credit or full_payment");
  }

  const medicineTypeRecord = await MedicineType.findOne({
    _id: medicineType,
    user: userId,
  });
  if (!medicineTypeRecord) {
    throw new Error("Medicine type not found");
  }

  const isTablet = medicineTypeRecord.type === "tablet";

  const payload = {
    user: userId,
    paymentType,
    supplierName: supplierName?.trim() ?? "",
    supplierNumber: supplierNumber?.trim() ?? "",
    medicineType,
    expiryDate: expiryDate ? new Date(expiryDate) : null,
  };

  if (isTablet) {
    if (!quantityType || !["box", "strips"].includes(quantityType)) {
      throw new Error("Quantity type (box or strips) is required when medicine type is Tablet");
    }

    let perPiecePrice;

    if (quantityType === "box") {
      if (
        boxQuantity == null ||
        piecesPerBox == null ||
        boxPrice == null
      ) {
        throw new Error("Box quantity, pieces per box, and box price are required when quantity type is box");
      }
      const totalPieces = Number(boxQuantity) * Number(piecesPerBox);
      if (totalPieces <= 0) {
        throw new Error("Box quantity × pieces per box must be greater than 0");
      }
      perPiecePrice = Number(boxPrice) / totalPieces;
      payload.quantityType = quantityType;
      payload.boxQuantity = Number(boxQuantity);
      payload.piecesPerBox = Number(piecesPerBox);
      payload.boxPrice = Number(boxPrice);
      payload.perPiecePrice = perPiecePrice;
    } else {
      if (
        stripsQuantity == null ||
        piecesPerStrip == null ||
        stripPrice == null
      ) {
        throw new Error(
          "Strips quantity, pieces per strip, and strip price are required when quantity type is strips"
        );
      }
      const totalPieces = Number(stripsQuantity) * Number(piecesPerStrip);
      if (totalPieces <= 0) {
        throw new Error("Strips quantity × pieces per strip must be greater than 0");
      }
      perPiecePrice = Number(stripPrice) / totalPieces;
      payload.quantityType = quantityType;
      payload.stripsQuantity = Number(stripsQuantity);
      payload.piecesPerStrip = Number(piecesPerStrip);
      payload.stripPrice = Number(stripPrice);
      payload.perPiecePrice = perPiecePrice;
    }
  } else {
    // Non-tablet: require total quantity and per-piece price
    if (totalQuantity == null || totalQuantity <= 0) {
      throw new Error("Total quantity is required and must be greater than 0 for this medicine type");
    }
    if (perPiecePriceInput == null || Number(perPiecePriceInput) < 0) {
      throw new Error("Per-piece price is required and must be 0 or more for this medicine type");
    }
    payload.totalQuantity = Number(totalQuantity);
    payload.perPiecePrice = Number(perPiecePriceInput);
  }

  const purchase = await MedicinePurchase.create(payload);
  return purchase;
};

export const getAllMedicinePurchases = async (userId) => {
  const purchases = await MedicinePurchase.find({
    user: userId,
    $or: [{ status: "active" }, { status: { $exists: false } }],
  })
    .populate("medicineType")
    .sort({ createdAt: -1 });
  return purchases;
};

export const getMedicinePurchaseById = async (id, userId) => {
  const purchase = await MedicinePurchase.findOne({
    _id: id,
    user: userId,
    $or: [{ status: "active" }, { status: { $exists: false } }],
  }).populate("medicineType");
  if (!purchase) {
    throw new Error("Purchase not found");
  }
  return purchase;
};

export const updateMedicinePurchase = async (id, data, userId) => {
  const purchase = await MedicinePurchase.findOne({
    _id: id,
    user: userId,
    $or: [{ status: "active" }, { status: { $exists: false } }],
  });
  if (!purchase) {
    throw new Error("Purchase not found");
  }
  const medicineTypeRecord = await MedicineType.findOne({
    _id: data.medicineType,
    user: userId,
  });
  if (!medicineTypeRecord) {
    throw new Error("Medicine type not found");
  }
  const isTablet = medicineTypeRecord.type === "tablet";
  const payload = {
    paymentType: data.paymentType,
    supplierName: data.supplierName?.trim() ?? "",
    supplierNumber: data.supplierNumber?.trim() ?? "",
    medicineType: data.medicineType,
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
  };
  if (isTablet) {
    if (data.quantityType === "box") {
      const totalPieces = Number(data.boxQuantity) * Number(data.piecesPerBox);
      payload.quantityType = "box";
      payload.boxQuantity = Number(data.boxQuantity);
      payload.piecesPerBox = Number(data.piecesPerBox);
      payload.boxPrice = Number(data.boxPrice);
      payload.perPiecePrice = Number(data.boxPrice) / totalPieces;
    } else {
      const totalPieces = Number(data.stripsQuantity) * Number(data.piecesPerStrip);
      payload.quantityType = "strips";
      payload.stripsQuantity = Number(data.stripsQuantity);
      payload.piecesPerStrip = Number(data.piecesPerStrip);
      payload.stripPrice = Number(data.stripPrice);
      payload.perPiecePrice = Number(data.stripPrice) / totalPieces;
    }
  } else {
    payload.totalQuantity = Number(data.totalQuantity);
    payload.perPiecePrice = Number(data.perPiecePrice);
  }
  const updated = await MedicinePurchase.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  ).populate("medicineType");
  return updated;
};

export const softDeleteMedicinePurchase = async (id, userId) => {
  const purchase = await MedicinePurchase.findOneAndUpdate(
    { _id: id, user: userId },
    { status: "deleted" },
    { new: true }
  );
  if (!purchase) {
    throw new Error("Purchase not found");
  }
  return purchase;
};
