import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { saveMedia } from "@/lib/blog-store";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel Functions accept request bodies up to 4.5 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Only PNG, JPEG, WebP, GIF or AVIF images." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Images must be under 4 MB." }, { status: 413 });

  const pathname = await saveMedia(file);
  return NextResponse.json({ url: `/blog/${pathname}` });
}
