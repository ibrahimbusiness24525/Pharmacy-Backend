import mongoose from "mongoose";

const MedicinePurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["credit", "full_payment"],
    },
    supplierName: {
      type: String,
      trim: true,
      default: "",
    },
    supplierNumber: {
      type: String,
      trim: true,
      default: "",
    },
    medicineType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicineType",
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    quantityType: {
      type: String,
      required: false,
      enum: ["box", "strips"],
      default: null,
    },
    // Box fields (when quantityType === "box")
    boxQuantity: { type: Number, default: null },
    piecesPerBox: { type: Number, default: null },
    boxPrice: { type: Number, default: null },
    // Strips fields (when quantityType === "strips")
    stripsQuantity: { type: Number, default: null },
    piecesPerStrip: { type: Number, default: null },
    stripPrice: { type: Number, default: null },
    // Per-piece price (calculated for Tablet from box/strips; entered directly for non-Tablet)
    perPiecePrice: {
      type: Number,
      required: false,
      default: null,
    },
    // Total quantity (for non-Tablet medicine types only)
    totalQuantity: {
      type: Number,
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

const MedicinePurchase = mongoose.model("MedicinePurchase", MedicinePurchaseSchema);

export default MedicinePurchase;
