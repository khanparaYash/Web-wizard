import express from "express";
import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { auth, adminOnly } from "../middleware/auth.js";
import { generateBorrowSlip } from "../utils/generateBorrowSlip.js";

const router = express.Router();

// POST /borrow/:bookId  (student borrows)
router.post("/:bookId", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ message: "Only students" });
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies < 1) return res.status(400).json({ message: "No copies available" });

    const borrow = await Borrow.create({
      userId: req.user.id,
      bookId: book._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    book.availableCopies -= 1;
    await book.save();

    const user = await User.findById(req.user.id);
    const slipUrl = await generateBorrowSlip(borrow, user, book);
    borrow.slipUrl = slipUrl;
    await borrow.save();

    // reward points for borrowing
    user.points = (user.points || 0) + 10;
    await user.save();

    res.status(201).json({ message: "Borrowed", borrow, slipUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /borrow/return/:borrowId  (admin scans slip -> return)
router.post("/return/:borrowId", auth, adminOnly, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId);
    if (!borrow) return res.status(404).json({ message: "Borrow not found" });
    if (borrow.status === "returned") return res.status(400).json({ message: "Already returned" });

    borrow.status = "returned";
    borrow.returnDate = new Date();

    // calculate fine
    const now = new Date();
    if (borrow.dueDate < now) {
      const daysLate = Math.ceil((now - borrow.dueDate) / (1000 * 60 * 60 * 24));
      borrow.fine = daysLate * 2; // example: 2 currency units per day
      // deduct points from user
      const user = await User.findById(borrow.userId);
      user.points = Math.max(0, (user.points || 0) - daysLate * 2);
      await user.save();
    } else {
      // reward on-time return
      const user = await User.findById(borrow.userId);
      user.points = (user.points || 0) + 5;
      await user.save();
    }

    await borrow.save();

    // update book availability
    const book = await Book.findById(borrow.bookId);
    book.availableCopies = Math.min(book.totalCopies, (book.availableCopies || 0) + 1);
    await book.save();

    res.json({ message: "Returned", borrow });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /borrow/me  (student gets their borrow history)
router.get("/me", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ message: "Only students" });
    const borrows = await Borrow.find({ userId: req.user.id })
      .populate("bookId", "title author")
      .sort({ borrowDate: -1 });
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /borrow/:id  (get specific borrow by ID - for QR scanning)
router.get("/:id", auth, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate("bookId", "title author")
      .populate("userId", "name email");
    
    if (!borrow) return res.status(404).json({ message: "Borrow not found" });
    
    res.json(borrow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /borrow/renew/:borrowId  (student requests renewal)
router.post("/renew/:borrowId", auth, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId);
    if (!borrow) return res.status(404).json({ message: "Borrow not found" });
    if (String(borrow.userId) !== req.user.id && req.user.role !== "admin") return res.status(403).json({ message: "Not allowed" });
    if (borrow.status !== "borrowed") return res.status(400).json({ message: "Cannot renew" });

    borrow.status = "renewRequested";
    await borrow.save();

    // admin will view pending renewals and approve/decline separately
    res.json({ message: "Renewal requested", borrow });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
