import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function generateInvoiceBuffer(invoice) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const buffer = [];
        doc.on("data", (chunk) => buffer.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffer)));
        doc.on("error", (err) => reject(err));
        // ===== Logo =====
        const logoPath = path.join(process.cwd(), "assets", "health_care_logo.png");
        doc.image(logoPath, 50, 45, { width: 100 });
        // Header
        doc.fontSize(22).text("INVOICE", 0, 50, { align: "right" }).moveDown();
        // Company Info
        doc
            .fontSize(12)
            .text("🏥 Health Care", 50, 160)
            .text("123 Road St.", 50, 175)
            .text("Chittagong, Bangladesh", 50, 190)
            .text("Email: jonydascse@gmail.com", 50, 205)
            .moveDown();
        // Customer Info
        doc
            .fontSize(12)
            .text(`Invoice To: ${invoice.customerName}`, 50, 250)
            .text(`Email: ${invoice.customerEmail}`, 50, 265)
            .moveDown();
        // Invoice Details
        doc
            .fontSize(12)
            .text(`Invoice Number: ${invoice.transactionId || "N/A"}`, { align: "right" })
            .text(`Date: ${invoice.date.toLocaleDateString()}`, { align: "right" })
            .moveDown();
        // Table headers
        const tableTop = 300;
        const itemX = 50;
        const detailsX = 200;
        const priceX = 400;
        doc
            .fontSize(12)
            .text("Item", itemX, tableTop)
            .text("Details", detailsX, tableTop)
            .text("Price", priceX, tableTop);
        // Booking row
        const position = tableTop + 25;
        doc
            .fontSize(11)
            .text("Doctor Appointment", itemX, position)
            .text(`Dr. ${invoice.doctorName} (${invoice.specialization})\nFrom: ${invoice.startTime} - To: ${invoice.endTime}`, detailsX, position)
            .text(`$${invoice.total.toFixed(2)}`, priceX, position);
        // Payment row
        doc
            .fontSize(11)
            .text("Payment Method", itemX, position + 60)
            .text(invoice.paymentType, detailsX, position + 60);
        // Total
        doc
            .fontSize(12)
            .text("Total:", itemX, position + 100)
            .text(`$${invoice.total.toFixed(2)}`, priceX, position + 100);
        // Footer
        doc
            .fontSize(10)
            .text("Thank you for your booking with Health Care!", 50, position + 150, {
            align: "center",
        });
        doc.end();
    });
}
