import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  cookieStore.delete("auth_session");
  cookieStore.delete("user_role");

  cookieStore.set("toast", "LOGOUT_SUCCESS", {
    path: "/",
    maxAge: 5,
  });

  const acceptHeader = request.headers.get("accept");

  if (acceptHeader?.includes("application/json")) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.redirect(new URL("/", request.url));
}