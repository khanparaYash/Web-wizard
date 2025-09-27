import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },
  points: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  badges: [{ id: String, name: String, awardedAt: Date }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
