import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ["signup", "login"],
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

OtpSchema.index({ email: 1, purpose: 1 }, { unique: true });

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;


