import express from "express";
import Borrow from "../models/Borrow.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET pending renewals
router.get("/", auth, adminOnly, async (req, res) => {
  const pending = await Borrow.find({ status: "renewRequested" }).populate("userId bookId");
  res.json(pending);
});

// POST /renewals/:borrowId/approve
router.post("/:borrowId/approve", auth, adminOnly, async (req, res) => {
  const borrow = await Borrow.findById(req.params.borrowId);
  if (!borrow) return res.status(404).json({ message: "Not found" });
  borrow.dueDate = new Date(borrow.dueDate.getTime() + 7 * 24 * 60 * 60 * 1000); // extend 7 days
  borrow.status = "borrowed";
  await borrow.save();
  res.json({ message: "Renewal approved", borrow });
});

// POST /renewals/:borrowId/decline
router.post("/:borrowId/decline", auth, adminOnly, async (req, res) => {
  const borrow = await Borrow.findById(req.params.borrowId);
  if (!borrow) return res.status(404).json({ message: "Not found" });
  borrow.status = "borrowed";
  await borrow.save();
  res.json({ message: "Renewal declined", borrow });
});

export default router;
