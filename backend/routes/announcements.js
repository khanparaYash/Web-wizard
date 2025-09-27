import express from "express";
import Announcement from "../models/Announcement.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const list = await Announcement.find().sort({ date: -1 }).limit(50);
  res.json(list);
});

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { title, message } = req.body;
    const a = await Announcement.create({ title, message });
    res.status(201).json(a);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /announcements/:id (admin updates announcement)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { title, message } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id, 
      { title, message }, 
      { new: true }
    );
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /announcements/:id (admin deletes announcement)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
