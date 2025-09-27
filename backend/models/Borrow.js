import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: Date,
  status: { type: String, enum: ["borrowed", "returned", "overdue", "renewRequested"], default: "borrowed" },
  fine: { type: Number, default: 0 },
  slipUrl: String,
}, { timestamps: true });

export default mongoose.model("Borrow", borrowSchema);
