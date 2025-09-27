import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Import models
import User from "./models/User.js";
import Book from "./models/Book.js";
import Announcement from "./models/Announcement.js";

dotenv.config();

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    totalCopies: 3,
    availableCopies: 3,
    avgRating: 4.2
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    totalCopies: 2,
    availableCopies: 2,
    avgRating: 4.5
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Dystopian Fiction",
    totalCopies: 4,
    availableCopies: 4,
    avgRating: 4.3
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    totalCopies: 2,
    availableCopies: 2,
    avgRating: 4.4
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    totalCopies: 3,
    availableCopies: 3,
    avgRating: 3.8
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    category: "Fiction",
    totalCopies: 2,
    availableCopies: 2,
    avgRating: 3.9
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    totalCopies: 3,
    availableCopies: 3,
    avgRating: 4.6
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    totalCopies: 5,
    availableCopies: 5,
    avgRating: 4.7
  },
  {
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    category: "Fantasy",
    totalCopies: 3,
    availableCopies: 3,
    avgRating: 4.3
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Philosophy",
    totalCopies: 2,
    availableCopies: 2,
    avgRating: 4.1
  }
];

const sampleAnnouncements = [
  {
    title: "Welcome to Our Library!",
    message: "We're excited to have you join our library community. Explore our vast collection of books and start your reading journey today!"
  },
  {
    title: "New Books Added",
    message: "Check out our latest additions to the collection. We've added several new titles across various genres."
  },
  {
    title: "Library Hours Update",
    message: "Our library is now open Monday to Friday from 9 AM to 8 PM, and Saturday from 10 AM to 6 PM."
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Announcement.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@library.com",
      passwordHash: adminPassword,
      role: "admin",
      points: 0
    });
    console.log("👤 Created admin user");

    // Create sample student users
    const studentPassword = await bcrypt.hash("student123", 10);
    const students = await User.create([
      {
        name: "John Doe",
        email: "john@student.com",
        passwordHash: studentPassword,
        role: "student",
        points: 45,
        badges: [{ id: "reader", name: "Book Reader", awardedAt: new Date() }]
      },
      {
        name: "Jane Smith",
        email: "jane@student.com",
        passwordHash: studentPassword,
        role: "student",
        points: 78,
        badges: [
          { id: "reader", name: "Book Reader", awardedAt: new Date() },
          { id: "reviewer", name: "Reviewer", awardedAt: new Date() }
        ]
      },
      {
        name: "Mike Johnson",
        email: "mike@student.com",
        passwordHash: studentPassword,
        role: "student",
        points: 32,
        badges: []
      }
    ]);
    console.log("👥 Created sample students");

    // Create sample books
    const books = await Book.create(sampleBooks);
    console.log("📚 Created sample books");

    // Create sample announcements
    await Announcement.create(sampleAnnouncements);
    console.log("📢 Created sample announcements");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("Admin: admin@library.com / admin123");
    console.log("Student: john@student.com / student123");
    console.log("Student: jane@student.com / student123");
    console.log("Student: mike@student.com / student123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedDatabase();
