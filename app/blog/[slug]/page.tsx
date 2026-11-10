import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BlogNav } from "@/components/BlogNav";
import { Starfield } from "@/components/Starfield";
import { formatDate, getPost, posts, readingMinutes, type PostBlock } from "@/lib/posts";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Post not found — Gabriel Thayil" };
  return { title: `${post.title} — Gabriel Thayil`, description: post.excerpt };
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "ul":
      return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
    case "code":
      return (
        <pre data-lang={block.lang}>
          <code>{block.code}</code>
        </pre>
      );
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    default:
      return <p>{block.text}</p>;
  }
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.indexOf(post);
  const newer = posts[index - 1];
  const older = posts[index + 1];

  return (
    <main>
      <Starfield />
      <div className="nebula-layer" aria-hidden="true" />
      <BlogNav />

      <article className={`mx-auto w-full max-w-3xl px-5 pb-24 pt-32 sm:px-8 accent-${post.accent}`} aria-labelledby="post-title">
        <Link href="/blog" className="blog-back"><ArrowLeft size={16} aria-hidden="true" /> All transmissions</Link>

        <header className="post-header">
          <div className="blog-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{readingMinutes(post)} min read</span>
          </div>
          <h1 id="post-title">{post.title}</h1>
          <p className="post-excerpt">{post.excerpt}</p>
          <div className="stack-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </header>

        <div className="post-body">
          {post.body.map((block, i) => <Block key={i} block={block} />)}
        </div>

        <nav className="post-pager" aria-label="More posts">
          {older ? (
            <Link href={`/blog/${older.slug}`}><span><ArrowLeft size={14} aria-hidden="true" /> Older</span>{older.title}</Link>
          ) : <span />}
          {newer ? (
            <Link href={`/blog/${newer.slug}`} className="text-right"><span>Newer <ArrowRight size={14} aria-hidden="true" /></span>{newer.title}</Link>
          ) : <span />}
        </nav>
      </article>
    </main>
  );
}
