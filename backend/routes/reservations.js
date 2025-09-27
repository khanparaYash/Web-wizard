import express from "express";
import Reservation from "../models/Reservation.js";
import Book from "../models/Book.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/:bookId", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // create reservation only if no copies
    if (book.availableCopies > 0) return res.status(400).json({ message: "Book available — borrow instead" });

    const existing = await Reservation.findOne({ userId: req.user.id, bookId: book._id, status: "pending" });
    if (existing) return res.status(400).json({ message: "Already in queue" });

    const r = await Reservation.create({ userId: req.user.id, bookId: book._id });
    res.status(201).json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/", auth, async (req, res) => {
  // return user's reservations
  const userRes = await Reservation.find({ userId: req.user.id }).populate("bookId");
  res.json(userRes);
});

export default router;
