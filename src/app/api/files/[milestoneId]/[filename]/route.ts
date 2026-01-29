import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  request: Request,
  context: { params: Promise<{ milestoneId: string; filename: string }> }
) {
  // ✅ FIX: unwrap params
  const { milestoneId, filename } = await context.params;

  if (!milestoneId || !filename) {
    return NextResponse.json(
      { error: "Invalid file path" },
      { status: 400 }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "uploads",
    milestoneId,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
