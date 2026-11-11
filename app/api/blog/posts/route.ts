import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { deletePost, listPosts, postExists, savePost } from "@/lib/blog-store";
import { parsePost, SLUG_PATTERN } from "@/lib/blog-types";

const unauthorized = () => NextResponse.json({ error: "Not signed in." }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return NextResponse.json({ posts: await listPosts({ includeDrafts: true }) });
}

/** Create or update a post. Body: { post, previousSlug? } — previousSlug renames an existing post. */
export async function PUT(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const body = await request.json().catch(() => null);
  const post = parsePost(body?.post);
  if (typeof post === "string") return NextResponse.json({ error: post }, { status: 400 });

  const previousSlug = typeof body?.previousSlug === "string" && SLUG_PATTERN.test(body.previousSlug) ? body.previousSlug : null;
  const isRename = previousSlug !== null && previousSlug !== post.slug;
  if ((previousSlug === null || isRename) && (await postExists(post.slug))) {
    return NextResponse.json({ error: `A post with the slug "${post.slug}" already exists.` }, { status: 409 });
  }

  await savePost(post);
  if (isRename) await deletePost(previousSlug);
  return NextResponse.json({ post });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!SLUG_PATTERN.test(slug)) return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  await deletePost(slug);
  return NextResponse.json({ ok: true });
}
