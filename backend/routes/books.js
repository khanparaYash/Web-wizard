import express from "express";
import Book from "../models/Book.js";
import Review from "../models/Review.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /books?search=&category=&sort=
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.$or = [{ title: new RegExp(search, "i") }, { author: new RegExp(search, "i") }];
    if (category) filter.category = category;
    const books = await Book.find(filter).limit(200);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { title, author, category, totalCopies = 1, coverUrl } = req.body;
    const book = await Book.create({ title, author, category, totalCopies, availableCopies: totalCopies, coverUrl });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /books/admin/stats (admin dashboard stats)
router.get("/admin/stats", auth, adminOnly, async (req, res) => {
  try {
    const Borrow = (await import("../models/Borrow.js")).default;
    
    const totalBooks = await Book.countDocuments();
    const activeBorrows = await Borrow.countDocuments({ status: "borrowed" });
    const overdueBorrows = await Borrow.countDocuments({ 
      status: "borrowed", 
      dueDate: { $lt: new Date() } 
    });
    
    // Most borrowed books
    const topBooks = await Borrow.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
      { $unwind: "$book" },
      { $project: { title: "$book.title", count: 1 } }
    ]);
    
    res.json({
      stats: { books: totalBooks, borrows: activeBorrows, overdue: overdueBorrows },
      topBooks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /books/:id (get single book with reviews)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    
    const reviews = await Review.find({ bookId: req.params.id })
      .populate("userId", "name")
      .sort({ date: -1 });
    
    res.json({ book, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
