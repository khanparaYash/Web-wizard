import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  status: { type: String, enum: ["pending", "notified", "fulfilled", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

reservationSchema.index({ bookId: 1, createdAt: 1 });
export default mongoose.model("Reservation", reservationSchema);
