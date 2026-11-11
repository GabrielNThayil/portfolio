import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders post markdown. Raw HTML in the source is ignored (react-markdown's default). */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children: label }) => {
          const external = href?.startsWith("http");
          return (
            <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {label}
            </a>
          );
        },
        // eslint-disable-next-line @next/next/no-img-element
        img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" />,
        pre: ({ children: code, node }) => {
          const lang = (node?.children?.[0] as { properties?: { className?: string[] } } | undefined)?.properties?.className
            ?.find((c) => c.startsWith("language-"))
            ?.replace("language-", "");
          return <pre data-lang={lang}>{code}</pre>;
        }
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
