import mongoose from "mongoose";

const annSchema = new mongoose.Schema({
  title: String,
  message: String,
  date: { type: Date, default: Date.now }
});
export default mongoose.model("Announcement", annSchema);
