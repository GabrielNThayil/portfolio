import { NextResponse } from "next/server";
import { adminConfigured, checkPassword, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Admin login is not set up yet. Add an ADMIN_PASSWORD environment variable (8+ characters)." }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!checkPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const { token, expires } = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(new Date(0)));
  return response;
}
