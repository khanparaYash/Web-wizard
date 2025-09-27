import express from "express";
import Review from "../models/Review.js";
import Book from "../models/Book.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// POST /reviews/:bookId
router.post("/:bookId", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.bookId;
    const review = await Review.create({ bookId, userId: req.user.id, rating, comment });

    // recalc avgRating
    const agg = await Review.aggregate([
      { $match: { bookId: review.bookId } },
      { $group: { _id: "$bookId", avgRating: { $avg: "$rating" } } }
    ]);
    const avg = agg[0]?.avgRating || rating;
    await Book.findByIdAndUpdate(bookId, { avgRating: avg });

    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /reviews/:bookId
router.get("/:bookId", async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).populate("userId", "name");
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
