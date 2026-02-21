import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  console.log("Server cookies:", cookieStore.getAll());

  return NextResponse.json({
    cookies: cookieStore.getAll(),
  });
}