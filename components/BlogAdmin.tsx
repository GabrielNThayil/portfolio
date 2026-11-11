"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Eye, ImagePlus, LogOut, PenLine, Plus, Save, Trash2 } from "lucide-react";
import { Markdown } from "./Markdown";
import { ACCENTS, formatDate, slugify, today, type Post } from "@/lib/blog-types";

type Draft = Omit<Post, "updatedAt" | "tags"> & { tags: string; updatedAt?: string };

const emptyDraft = (): Draft => ({
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tags: "",
  accent: "ion",
  date: today(),
  published: false
});

const toDraft = (post: Post): Draft => ({ ...post, tags: post.tags.join(", ") });
const toPayload = (draft: Draft) => ({
  ...draft,
  tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean)
});

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`);
  return data as T;
}

function Login({ configured, onSignedIn }: { configured: boolean; onSignedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="admin-login">
      <p className="hud-label">Restricted // Mission Control</p>
      <h1 className="section-title">Blog admin</h1>
      {!configured ? (
        <p className="admin-error">
          Login isn&apos;t set up yet. Add an <code>ADMIN_PASSWORD</code> environment variable (at least 8 characters) to the Vercel project, then redeploy.
        </p>
      ) : (
        <form
          className="terminal-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            try {
              await api("/api/blog/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
              });
              onSignedIn();
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label htmlFor="admin-password">
            Password
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
          </label>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button type="submit" disabled={busy || !password}>{busy ? "Checking…" : "Sign in"}</button>
        </form>
      )}
      <Link href="/blog" className="blog-back"><ArrowLeft size={16} aria-hidden="true" /> Back to blog</Link>
    </div>
  );
}

export function BlogAdmin({ signedIn: initiallySignedIn, configured }: { signedIn: boolean; configured: boolean }) {
  const [signedIn, setSignedIn] = useState(initiallySignedIn);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [savedSlug, setSavedSlug] = useState<string | null>(null); // slug of the post being edited, null = new
  const [slugTouched, setSlugTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { posts } = await api<{ posts: Post[] }>("/api/blog/posts");
      setPosts(posts);
      return posts;
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
      if ((err as Error).message === "Not signed in.") setSignedIn(false);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const openPost = useCallback((post: Post | null) => {
    setDraft(post ? toDraft(post) : emptyDraft());
    setSavedSlug(post?.slug ?? null);
    setSlugTouched(Boolean(post));
    setDirty(false);
    setTab("write");
    setStatus(null);
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    refresh().then((loaded) => {
      const edit = new URLSearchParams(window.location.search).get("edit");
      const match = edit ? loaded.find((p) => p.slug === edit) : undefined;
      if (match) openPost(match);
    });
  }, [signedIn, refresh, openPost]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
    setDirty(true);
  };

  const confirmDiscard = () => !dirty || window.confirm("You have unsaved changes. Discard them?");

  const save = useCallback(
    async (publish?: boolean) => {
      setBusy(true);
      setStatus(null);
      try {
        const payload = toPayload(publish === undefined ? draft : { ...draft, published: publish });
        const { post } = await api<{ post: Post }>("/api/blog/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post: payload, previousSlug: savedSlug })
        });
        setDraft(toDraft(post));
        setSavedSlug(post.slug);
        setSlugTouched(true);
        setDirty(false);
        setStatus({ kind: "ok", text: post.published ? "Saved — live on the blog." : "Saved as draft." });
        await refresh();
      } catch (err) {
        setStatus({ kind: "error", text: (err as Error).message });
      } finally {
        setBusy(false);
      }
    },
    [draft, savedSlug, refresh]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!busy && draft.title) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, busy, draft.title]);

  const remove = async () => {
    if (!savedSlug || !window.confirm(`Delete "${draft.title}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await api(`/api/blog/posts?slug=${encodeURIComponent(savedSlug)}`, { method: "DELETE" });
      openPost(null);
      setStatus({ kind: "ok", text: "Post deleted." });
      await refresh();
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const insertAtCursor = (text: string) => {
    const el = textarea.current;
    const start = el?.selectionStart ?? draft.content.length;
    const end = el?.selectionEnd ?? draft.content.length;
    update("content", draft.content.slice(0, start) + text + draft.content.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const uploadImage = async (file: File) => {
    setBusy(true);
    setStatus({ kind: "ok", text: "Uploading image…" });
    try {
      const form = new FormData();
      form.append("file", file);
      const { url } = await api<{ url: string }>("/api/blog/media", { method: "POST", body: form });
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      insertAtCursor(`\n![${alt}](${url})\n`);
      setTab("write");
      setStatus({ kind: "ok", text: "Image added." });
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    if (!confirmDiscard()) return;
    await fetch("/api/blog/session", { method: "DELETE" });
    setSignedIn(false);
    setPosts([]);
    openPost(null);
  };

  const words = useMemo(() => draft.content.trim().split(/\s+/).filter(Boolean).length, [draft.content]);

  if (!signedIn) {
    return (
      <div className="mx-auto w-full max-w-md px-5 pb-24 pt-28 sm:px-8">
        <Login configured={configured} onSignedIn={() => setSignedIn(true)} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-10 sm:px-8">
      <header className="admin-topbar">
        <div>
          <p className="hud-label">Mission Control // Blog</p>
          <h1 className="admin-title">Transmissions</h1>
        </div>
        <div className="admin-actions">
          <Link href="/blog" className="icon-btn"><Eye size={16} aria-hidden="true" /> View blog</Link>
          <button type="button" className="icon-btn" onClick={signOut}><LogOut size={16} aria-hidden="true" /> Sign out</button>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Posts">
          <button type="button" className="primary-btn w-full" onClick={() => confirmDiscard() && openPost(null)}>
            <Plus size={16} aria-hidden="true" /> New post
          </button>
          {loading && posts.length === 0 && <p className="admin-muted">Loading…</p>}
          {!loading && posts.length === 0 && <p className="admin-muted">No posts yet. Write your first one.</p>}
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <button
                  type="button"
                  className={`admin-post-item ${post.slug === savedSlug ? "is-active" : ""}`}
                  onClick={() => post.slug !== savedSlug && confirmDiscard() && openPost(post)}
                >
                  <span className={`admin-status ${post.published ? "is-live" : ""}`}>{post.published ? "Live" : "Draft"}</span>
                  <strong>{post.title}</strong>
                  <small>{formatDate(post.date)}</small>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="admin-editor" aria-label="Editor">
          <div className="admin-editor-head">
            <p className="hud-label">{savedSlug ? "Editing" : "New post"}{dirty ? " · unsaved" : ""}</p>
            {savedSlug && (
              <Link href={`/blog/${savedSlug}`} className="blog-back" target="_blank">
                <Eye size={14} aria-hidden="true" /> {draft.published ? "Open live post" : "Preview draft"}
              </Link>
            )}
          </div>

          <input
            className="admin-title-input"
            placeholder="Post title"
            value={draft.title}
            onChange={(e) => update("title", e.target.value)}
            aria-label="Title"
          />

          <div className="admin-fields">
            <label>
              Slug
              <span className="admin-slug">
                <span aria-hidden="true">/blog/</span>
                <input
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update("slug", slugify(e.target.value) || e.target.value.toLowerCase());
                  }}
                  placeholder="my-post"
                />
              </span>
            </label>
            <label>
              Date
              <input type="date" value={draft.date} onChange={(e) => update("date", e.target.value)} />
            </label>
            <label>
              Accent
              <select value={draft.accent} onChange={(e) => update("accent", e.target.value as Draft["accent"])}>
                {ACCENTS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label className="admin-wide">
              Tags <small>(comma separated)</small>
              <input value={draft.tags} onChange={(e) => update("tags", e.target.value)} placeholder="AI, Spring Boot, Hackathons" />
            </label>
            <label className="admin-wide">
              Summary <small>(shown on the blog list)</small>
              <textarea rows={2} value={draft.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="One or two sentences about the post." />
            </label>
          </div>

          <div className="admin-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")}><PenLine size={14} aria-hidden="true" /> Write</button>
            <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}><Eye size={14} aria-hidden="true" /> Preview</button>
            <button type="button" className="ml-auto" onClick={() => fileInput.current?.click()} disabled={busy}>
              <ImagePlus size={14} aria-hidden="true" /> Add image
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
                e.target.value = "";
              }}
            />
          </div>

          {tab === "write" ? (
            <textarea
              ref={textarea}
              className="admin-body"
              value={draft.content}
              onChange={(e) => update("content", e.target.value)}
              onPaste={(e) => {
                const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
                if (file) {
                  e.preventDefault();
                  uploadImage(file);
                }
              }}
              placeholder={"Write in Markdown.\n\n## A heading\n\nSome text with **bold**, *italics* and [a link](https://example.com).\n\n- a list\n- of things\n\n```js\nconsole.log('code blocks work too')\n```"}
              aria-label="Post body (Markdown)"
            />
          ) : (
            <div className={`admin-preview post-body accent-${draft.accent}`}>
              {draft.content.trim() ? <Markdown>{draft.content}</Markdown> : <p className="admin-muted">Nothing to preview yet.</p>}
            </div>
          )}

          <footer className="admin-footer">
            <span className="admin-muted">{words} words · Markdown · Ctrl+S to save</span>
            {status && <span className={status.kind === "error" ? "admin-error" : "admin-ok"} role="status">{status.text}</span>}
            <div className="admin-actions">
              {savedSlug && (
                <button type="button" className="icon-btn admin-danger" onClick={remove} disabled={busy}>
                  <Trash2 size={16} aria-hidden="true" /> Delete
                </button>
              )}
              {draft.published ? (
                <button type="button" className="icon-btn" onClick={() => save(false)} disabled={busy || !draft.title}>Unpublish</button>
              ) : (
                <button type="button" className="icon-btn" onClick={() => save(false)} disabled={busy || !draft.title}>
                  <Save size={16} aria-hidden="true" /> Save draft
                </button>
              )}
              <button type="button" className="primary-btn" onClick={() => save(true)} disabled={busy || !draft.title}>
                {draft.published ? <><Save size={16} aria-hidden="true" /> Update</> : "Publish"}
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
