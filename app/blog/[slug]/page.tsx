import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, PenLine } from "lucide-react";
import { BlogNav } from "@/components/BlogNav";
import { Markdown } from "@/components/Markdown";
import { Starfield } from "@/components/Starfield";
import { isAdmin } from "@/lib/admin-auth";
import { getPost, listPosts } from "@/lib/blog-store";
import { formatDate, readingMinutes, SLUG_PATTERN } from "@/lib/blog-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

async function loadPost(slug: string) {
  if (!SLUG_PATTERN.test(slug)) return null;
  const post = await getPost(slug);
  if (!post) return null;
  if (!post.published && !(await isAdmin())) return null; // drafts are visible to you only
  return post;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  if (!post) return { title: "Post not found — Gabriel Thayil" };
  return {
    title: `${post.title} — Gabriel Thayil`,
    description: post.excerpt || undefined,
    robots: post.published ? undefined : { index: false }
  };
}

export default async function BlogPost({ params }: Params) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();

  const admin = await isAdmin();
  const published = await listPosts();
  const index = published.findIndex((p) => p.slug === post.slug);
  const newer = index > 0 ? published[index - 1] : undefined;
  const older = index >= 0 ? published[index + 1] : undefined;

  return (
    <main>
      <Starfield />
      <div className="nebula-layer" aria-hidden="true" />
      <BlogNav />

      <article className={`mx-auto w-full max-w-3xl px-5 pb-24 pt-32 sm:px-8 accent-${post.accent}`} aria-labelledby="post-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/blog" className="blog-back"><ArrowLeft size={16} aria-hidden="true" /> All transmissions</Link>
          {admin && (
            <Link href={`/blog/admin?edit=${post.slug}`} className="blog-back"><PenLine size={16} aria-hidden="true" /> Edit post</Link>
          )}
        </div>

        {!post.published && <p className="draft-banner">Draft — only you can see this page.</p>}

        <header className="post-header">
          <div className="blog-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{readingMinutes(post)} min read</span>
          </div>
          <h1 id="post-title">{post.title}</h1>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          <div className="stack-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </header>

        <div className="post-body">
          <Markdown>{post.content}</Markdown>
        </div>

        {(older || newer) && (
          <nav className="post-pager" aria-label="More posts">
            {older ? (
              <Link href={`/blog/${older.slug}`}><span><ArrowLeft size={14} aria-hidden="true" /> Older</span>{older.title}</Link>
            ) : <span />}
            {newer ? (
              <Link href={`/blog/${newer.slug}`} className="text-right"><span>Newer <ArrowRight size={14} aria-hidden="true" /></span>{newer.title}</Link>
            ) : <span />}
          </nav>
        )}
      </article>
    </main>
  );
}
