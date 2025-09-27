import cron from "node-cron";
import Borrow from "../models/Borrow.js";
import User from "../models/User.js";
// placeholder email function
async function sendEmail(to, subject, text) {
  console.log("EMAIL:", to, subject, text);
}

export function startReminders() {
  // run every day at 08:00
  cron.schedule("0 8 * * *", async () => {
    console.log("[cron] checking due soon borrows...");
    const in2days = new Date(); in2days.setDate(in2days.getDate() + 2);
    const dueSoon = await Borrow.find({ dueDate: { $lte: in2days }, returnDate: null }).populate("userId bookId");
    for (const b of dueSoon) {
      const user = await User.findById(b.userId);
      await sendEmail(user.email, "Book due soon", `Your borrowed book ${b.bookId.title} is due on ${b.dueDate.toDateString()}.`);
    }
  });
}
