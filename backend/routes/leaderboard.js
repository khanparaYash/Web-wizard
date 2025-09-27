import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const top = await User.find().sort({ points: -1 }).limit(50).select("name points badges");
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
