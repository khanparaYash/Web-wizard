import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import borrowRoutes from "./routes/borrow.js";
import reviewRoutes from "./routes/reviews.js";
import reservationRoutes from "./routes/reservations.js";
import announcementRoutes from "./routes/announcements.js";
import donationRoutes from "./routes/donations.js";
import recommendationRoutes from "./routes/recommendations.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import renewalRoutes from "./routes/renewals.js";
import { startReminders } from "./jobs/reminders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: "5mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// serve slip PDFs
app.use("/slips", express.static(path.join(__dirname, "slips")));

app.get("/", (req, res) => res.send("✅ Library Backend is running"));

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/borrow", borrowRoutes);
app.use("/reviews", reviewRoutes);
app.use("/reservations", reservationRoutes);
app.use("/announcements", announcementRoutes);
app.use("/donations", donationRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/renewals", renewalRoutes);
startReminders();

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connect error:", err));
