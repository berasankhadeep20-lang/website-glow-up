import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { sanityClient, urlFor, BlogPost as BlogPostT, CATEGORY_LABELS } from "@/lib/sanity";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import ParticleCanvas from "@/components/ParticleCanvas";

const QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, excerpt, category, tags, coverImage, publishedAt, readingTimeMinutes, body
}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(body: any[] | undefined): TocItem[] {
  if (!Array.isArray(body)) return [];
  return body
    .filter((b: any) => b._type === "block" && /^h[2-3]$/.test(b.style || ""))
    .map((b: any) => {
      const text = (b.children || []).map((c: any) => c.text).join("");
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      return { id, text, level: parseInt(b.style.substring(1)) };
    });
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostT | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    sanityClient
      .fetch<BlogPostT>(QUERY, { slug })
      .then((d) => setPost(d || null))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  const toc = useMemo(() => extractToc(post?.body), [post]);

  useEffect(() => {
    if (toc.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading post…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/" className="text-primary underline">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <>
      <ParticleCanvas />
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] gradient-bg origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-[1fr_240px] gap-10">
        <article>
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            {post.category && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {CATEGORY_LABELS[post.category] || post.category}
              </span>
            )}
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTimeMinutes && <span>· {post.readingTimeMinutes} min read</span>}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-muted-foreground mb-8">{post.excerpt}</p>}

          {post.coverImage && (
            <img
              src={urlFor(post.coverImage).width(1400).height(600).fit("crop").auto("format").url()}
              alt={post.title}
              className="w-full rounded-2xl mb-10"
            />
          )}

          {post.body && <PortableTextRenderer value={post.body} />}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-6 border-t border-border/50">
              {post.tags.map((t) => (
                <span key={t} className="text-xs text-accent">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </article>

        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                On this page
              </h3>
              <nav className="space-y-2 text-sm border-l border-border/60 pl-4">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className={`block transition-colors ${
                      t.level === 3 ? "pl-3 text-xs" : ""
                    } ${
                      activeId === t.id
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {t.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </>
  );
};

export default BlogPostPage;