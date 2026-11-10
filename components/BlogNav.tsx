import Link from "next/link";

const links = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" }
];

export function BlogNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-void/75 px-5 py-4 backdrop-blur-xl" aria-label="Primary navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="font-display text-sm font-bold uppercase tracking-[0.28em] text-white">GT // ORBITAL</Link>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-white/62 sm:gap-5">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition hover:text-ion ${item.label === "Blog" ? "text-aurora" : item.label === "Contact" ? "" : "hidden sm:inline"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
