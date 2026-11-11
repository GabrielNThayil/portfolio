import { readMedia } from "@/lib/blog-store";

/** Serves uploaded blog images from the private Blob store. File names are random and never overwritten. */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const media = await readMedia(`media/${path.join("/")}`);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(media.body as BodyInit, {
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
