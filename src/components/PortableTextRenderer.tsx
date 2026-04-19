import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { urlFor } from "@/lib/sanity";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={urlFor(value).width(1200).fit("max").auto("format").url()}
        alt={value.alt || ""}
        loading="lazy"
        className="my-6 rounded-xl border border-border/50"
      />
    ),
    codeBlock: ({ value }) => (
      <div className="my-6 rounded-xl overflow-hidden border border-border/50">
        <SyntaxHighlighter
          language={value.language || "text"}
          style={oneDark}
          customStyle={{ margin: 0, fontSize: "0.85rem", background: "hsl(var(--muted))" }}
        >
          {value.code || ""}
        </SyntaxHighlighter>
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 gradient-text">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-5 mb-2 text-foreground">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="my-3 leading-relaxed text-foreground/90">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm">{children}</code>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 my-3 space-y-1">{children}</ol>,
  },
};

export const PortableTextRenderer = ({ value }: { value: any[] }) => (
  <PortableText value={value} components={components} />
);
