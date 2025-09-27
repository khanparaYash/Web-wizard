import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorName: String,
  donorEmail: String,
  title: String,
  author: String,
  description: String,
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Donation", donationSchema);
