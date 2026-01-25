import mongoose from "mongoose";

const MedicineTypeSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["injections", "tablet", "syp", "skin-care", "hair", "drip"],
    },
    // Common fields
    productName: {
      type: String,
      trim: true,
    },
    // Type-specific fields
    // For syp: ml
    ml: {
      type: String,
      trim: true,
    },
    // For tablet: gram
    gram: {
      type: String,
      trim: true,
    },
    // For skin-care: creamOrLotion, unit
    creamOrLotion: {
      type: String,
      enum: ["cream", "lotion"],
      trim: true,
    },
    unit: {
      type: String,
      enum: ["ml", "mg", "size"],
      trim: true,
    },
    // For drip: specific fields (will be handled in UI)
    dripDetails: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const MedicineType = mongoose.model("MedicineType", MedicineTypeSchema);

export default MedicineType;

