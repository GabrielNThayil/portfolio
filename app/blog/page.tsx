import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogNav } from "@/components/BlogNav";
import { Starfield } from "@/components/Starfield";
import { listPosts } from "@/lib/blog-store";
import { formatDate, readingMinutes, type Post } from "@/lib/blog-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Gabriel Thayil",
  description: "Engineering notes from Gabriel Thayil on AI systems, full-stack development, hackathons, and building real products."
};

function PostCard({ post, index, featured }: { post: Post; index: number; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className={`blog-card accent-${post.accent} ${featured ? "blog-featured" : ""}`}>
      <div className="blog-meta">
        {featured ? <span className="blog-flag">Latest</span> : <span className="cluster-index">{String(index + 1).padStart(2, "0")}</span>}
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{readingMinutes(post)} min read</span>
      </div>
      <h2>{post.title}</h2>
      {post.excerpt && <p>{post.excerpt}</p>}
      <div className="blog-card-foot">
        <div className="stack-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <span className="blog-read">Read <ArrowUpRight size={16} aria-hidden="true" /></span>
      </div>
    </Link>
  );
}

export default async function BlogIndex() {
  const [featured, ...rest] = await listPosts();

  return (
    <main>
      <Starfield />
      <div className="nebula-layer" aria-hidden="true" />
      <BlogNav />

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8" aria-labelledby="blog-title">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="hud-label">08 // Transmission Log</p>
            <h1 id="blog-title" className="section-title">Field Notes</h1>
            <p className="blog-intro">
              Write-ups from the projects, hackathons, and experiments — what worked, what didn&apos;t, and what I&apos;d do differently.
            </p>
          </div>
          <div className="constellation-line hidden sm:block" />
        </div>

        {featured ? (
          <>
            <PostCard post={featured} index={0} featured />
            <div className="blog-grid">
              {rest.map((post, i) => <PostCard key={post.slug} post={post} index={i + 1} />)}
            </div>
          </>
        ) : (
          <div className="blog-empty">
            <p className="hud-label">No signal yet</p>
            <p>The first transmission is on its way. Check back soon.</p>
          </div>
        )}
      </section>
    </main>
  );
}
