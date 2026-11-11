import "server-only";
import { del, get, list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { Post } from "./blog-types";

/**
 * Posts live in a private Vercel Blob store as `posts/<slug>.json`; images as `media/<id>-<name>`.
 * In local development without Blob credentials, a `.blog-data/` folder is used instead.
 */

const hasBlobCredentials = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN));

const useLocalFiles = () => {
  if (hasBlobCredentials()) return false;
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    throw new Error("Blog storage is not configured: connect a Vercel Blob store to this project.");
  }
  return true;
};

const LOCAL_DIR = path.join(process.cwd(), ".blog-data");
const localPath = (pathname: string) => {
  const full = path.join(LOCAL_DIR, pathname);
  if (!full.startsWith(LOCAL_DIR + path.sep)) throw new Error("Invalid path");
  return full;
};

const postPath = (slug: string) => `posts/${slug}.json`;

async function readText(pathname: string): Promise<string | null> {
  if (useLocalFiles()) {
    try {
      return await fs.readFile(localPath(pathname), "utf8");
    } catch {
      return null;
    }
  }
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return new Response(result.stream).text();
}

async function readPost(pathname: string): Promise<Post | null> {
  const text = await readText(pathname);
  if (!text) return null;
  try {
    return JSON.parse(text) as Post;
  } catch {
    return null;
  }
}

async function listPostPaths(): Promise<string[]> {
  if (useLocalFiles()) {
    try {
      const files = await fs.readdir(path.join(LOCAL_DIR, "posts"));
      return files.filter((f) => f.endsWith(".json")).map((f) => `posts/${f}`);
    } catch {
      return [];
    }
  }
  const paths: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "posts/", cursor });
    paths.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return paths;
}

const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt);

export async function listPosts({ includeDrafts = false } = {}): Promise<Post[]> {
  const posts = (await Promise.all((await listPostPaths()).map(readPost))).filter((p): p is Post => p !== null);
  return posts.filter((p) => includeDrafts || p.published).sort(byNewest);
}

export async function getPost(slug: string): Promise<Post | null> {
  return readPost(postPath(slug));
}

export async function postExists(slug: string) {
  return (await readText(postPath(slug))) !== null;
}

export async function savePost(post: Post) {
  const body = JSON.stringify(post, null, 2);
  if (useLocalFiles()) {
    const file = localPath(postPath(post.slug));
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, body, "utf8");
    return;
  }
  await put(postPath(post.slug), body, {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true
  });
}

export async function deletePost(slug: string) {
  if (useLocalFiles()) {
    await fs.rm(localPath(postPath(slug)), { force: true });
    return;
  }
  await del(postPath(slug));
}

export async function saveMedia(file: File): Promise<string> {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "").slice(-60) || "image";
  const pathname = `media/${randomBytes(6).toString("hex")}-${safeName}`;
  if (useLocalFiles()) {
    const target = localPath(pathname);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
    await fs.writeFile(`${target}.type`, file.type, "utf8");
    return pathname;
  }
  await put(pathname, file, { access: "private", contentType: file.type, addRandomSuffix: false });
  return pathname;
}

export async function readMedia(pathname: string): Promise<{ body: ReadableStream<Uint8Array> | Buffer; contentType: string } | null> {
  if (!/^media\/[a-z0-9.-]+$/.test(pathname)) return null;
  if (useLocalFiles()) {
    try {
      const target = localPath(pathname);
      const [body, contentType] = await Promise.all([fs.readFile(target), fs.readFile(`${target}.type`, "utf8")]);
      return { body, contentType };
    } catch {
      return null;
    }
  }
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return { body: result.stream, contentType: result.blob.contentType };
}
