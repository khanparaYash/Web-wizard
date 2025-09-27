import express from "express";
import mongoose from "mongoose";
import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import Review from "../models/Review.js";

const router = express.Router();

// GET /recommendations/:userId
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    // 1) Most borrowed
    const mostBorrowedAgg = await Borrow.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const mostBorrowedIds = mostBorrowedAgg.map(a => a._id);

    // 2) Highest rated
    const topRated = await Book.find().sort({ avgRating: -1 }).limit(5);

    // 3) Category match: get top categories for user
    const catAgg = await Borrow.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
      { $unwind: "$book" },
      { $group: { _id: "$book.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 2 }
    ]);
    const categories = catAgg.map(c => c._id);
    const catBooks = await Book.find({ category: { $in: categories } }).limit(10);

    // Fetch actual book documents for mostBorrowed
    const mb = await Book.find({ _id: { $in: mostBorrowedIds } });

    res.json({
      mostBorrowed: mb,
      topRated,
      categoryMatch: catBooks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
