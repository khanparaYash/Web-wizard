import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function generateBorrowSlip(borrow, user, book) {
  const qrData = JSON.stringify({ type: "borrow", borrowId: borrow._id.toString() });
  const qrDataUrl = await QRCode.toDataURL(qrData); // base64 image

  if (!fs.existsSync(path.join(process.cwd(), "slips"))) fs.mkdirSync(path.join(process.cwd(), "slips"));

  const fileName = `borrow-slip-${borrow._id}.pdf`;
  const filePath = path.join(process.cwd(), "slips", fileName);
  const doc = new PDFDocument({ margin: 40 });
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.fontSize(20).text("Library Borrow Slip", { align: "center" }).moveDown();
  doc.fontSize(12).text(`Book: ${book.title}`);
  doc.text(`Author: ${book.author}`);
  doc.text(`Borrower: ${user.name} (${user.email})`);
  doc.text(`Borrow Date: ${new Date(borrow.borrowDate).toLocaleString()}`);
  doc.text(`Due Date: ${new Date(borrow.dueDate).toLocaleDateString()}`);
  doc.moveDown();

  // image expects buffer or path, convert base64 to buffer
  const base64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(base64, "base64");
  doc.image(qrBuffer, { fit: [150, 150], align: "center" });

  doc.end();

  // return a promise that resolves when the file is written
  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(`/slips/${fileName}`));
    writeStream.on("error", reject);
  });
}
