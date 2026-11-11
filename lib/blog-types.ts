export const ACCENTS = ["aurora", "ion", "plasma", "ember"] as const;
export type Accent = (typeof ACCENTS)[number];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown body */
  content: string;
  tags: string[];
  accent: Accent;
  /** Publish date, yyyy-mm-dd */
  date: string;
  published: boolean;
  updatedAt: string;
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Paths under /blog that are taken by app routes. */
const RESERVED_SLUGS = ["admin", "media"];

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function readingMinutes(post: Pick<Post, "content">) {
  const words = post.content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Validates and normalises an incoming post payload. Returns an error string on failure. */
export function parsePost(input: unknown): Post | string {
  if (!input || typeof input !== "object") return "Invalid post.";
  const raw = input as Record<string, unknown>;
  const str = (key: string, max: number) => (typeof raw[key] === "string" ? (raw[key] as string).trim().slice(0, max) : "");

  const title = str("title", 200);
  const slug = str("slug", 80);
  const date = str("date", 10);
  if (!title) return "Title is required.";
  if (!SLUG_PATTERN.test(slug)) return "Slug can only use lowercase letters, numbers and single dashes.";
  if (RESERVED_SLUGS.includes(slug)) return `"${slug}" is reserved — pick another slug.`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Date must be yyyy-mm-dd.";

  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === "string").map((t) => t.trim().slice(0, 40)).filter(Boolean).slice(0, 12)
    : [];
  const accent = ACCENTS.includes(raw.accent as Accent) ? (raw.accent as Accent) : "ion";

  return {
    slug,
    title,
    excerpt: str("excerpt", 400),
    content: typeof raw.content === "string" ? raw.content.slice(0, 200_000) : "",
    tags,
    accent,
    date,
    published: raw.published === true,
    updatedAt: new Date().toISOString()
  };
}
