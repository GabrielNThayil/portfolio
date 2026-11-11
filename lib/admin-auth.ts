import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "blog_admin";
const SESSION_DAYS = 30;

const secret = () => process.env.ADMIN_PASSWORD ?? "";

export const adminConfigured = () => secret().length >= 8;

function sign(payload: string) {
  return createHmac("sha256", `blog-admin:${secret()}`).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(candidate: string) {
  return adminConfigured() && safeEqual(candidate, secret());
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return { token: `${expires}.${sign(String(expires))}`, expires: new Date(expires) };
}

function verifyToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

/** True when the current request carries a valid admin session cookie. */
export async function isAdmin() {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = (expires: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  expires
});
