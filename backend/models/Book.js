import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  qrCode: String, // optional base64 or URL
  avgRating: { type: Number, default: 0 },
  coverUrl: String,
  donatedBy: String, // optional donor name
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
