export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role?.toLowerCase() !== "creator") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const payments = await Payment.find({ creatorId: userId })
    .sort({ createdAt: -1 })
    .lean();

  const totalReleased = payments
    .filter((p) => p.status === "RELEASED")
    .reduce((sum, p) => sum + p.amount, 0);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Load font from public folder
  const fontPath = path.join(process.cwd(), "public/fonts/NotoSans-Regular.ttf");
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage([595, 842]);

  let y = 800;

  page.drawText("MAKNE Earnings Statement", {
    x: 50,
    y,
    size: 18,
    font: customFont,
  });

  y -= 30;

  page.drawText(`Generated: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y,
    size: 12,
    font: customFont,
  });

  y -= 20;

  page.drawText(`Total Released Earnings: ₹${totalReleased}`, {
    x: 50,
    y,
    size: 12,
    font: customFont,
  });

  y -= 30;

  page.drawText("Date", { x: 50, y, size: 12, font: customFont });
  page.drawText("Amount", { x: 200, y, size: 12, font: customFont });
  page.drawText("Status", { x: 350, y, size: 12, font: customFont });

  y -= 15;

  payments.forEach((p) => {
    if (y < 50) return;

    page.drawText(
      new Date(p.createdAt).toLocaleDateString(),
      { x: 50, y, size: 10, font: customFont }
    );

    page.drawText(`₹${p.amount}`, {
      x: 200,
      y,
      size: 10,
      font: customFont,
    });

    page.drawText(p.status, {
      x: 350,
      y,
      size: 10,
      font: customFont,
    });

    y -= 15;
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        "attachment; filename=makne-earnings-statement.pdf",
    },
  });
}