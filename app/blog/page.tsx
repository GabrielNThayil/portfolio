import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogNav } from "@/components/BlogNav";
import { Starfield } from "@/components/Starfield";
import { formatDate, posts, readingMinutes } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Gabriel Thayil",
  description: "Engineering notes from Gabriel Thayil on AI systems, full-stack development, hackathons, and building real products."
};

export default function BlogIndex() {
  const [featured, ...rest] = posts;

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

        {featured && (
          <Link href={`/blog/${featured.slug}`} className={`blog-card blog-featured accent-${featured.accent}`}>
            <div className="blog-meta">
              <span className="blog-flag">Latest</span>
              <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              <span>{readingMinutes(featured)} min read</span>
            </div>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <div className="blog-card-foot">
              <div className="stack-row">{featured.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <span className="blog-read">Read <ArrowUpRight size={16} aria-hidden="true" /></span>
            </div>
          </Link>
        )}

        <div className="blog-grid">
          {rest.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={`blog-card accent-${post.accent}`}>
              <div className="blog-meta">
                <span className="cluster-index">{String(index + 2).padStart(2, "0")}</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>{readingMinutes(post)} min read</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="blog-card-foot">
                <div className="stack-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <span className="blog-read">Read <ArrowUpRight size={16} aria-hidden="true" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
