import express from "express";
import Donation from "../models/Donation.js";
import Book from "../models/Book.js";
import { auth, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { title, author, description } = req.body;
  const donor = await Donation.create({ donorName: req.user.name || "Anonymous", donorEmail: req.user.email, title, author, description });
  res.status(201).json(donor);
});

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const list = await Donation.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /donations/:id (admin approves/declines donation)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    
    // If approved, add book to catalog
    if (status === "approved") {
      const Book = (await import("../models/Book.js")).default;
      const User = (await import("../models/User.js")).default;
      
      await Book.create({
        title: donation.title,
        author: donation.author,
        category: "Donated",
        donatedBy: donation.donorName,
        totalCopies: 1,
        availableCopies: 1
      });
      
      // Give bonus points to donor
      const donor = await User.findOne({ email: donation.donorEmail });
      if (donor) {
        donor.points = (donor.points || 0) + 50; // bonus points for donation
        await donor.save();
      }
    }
    
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
