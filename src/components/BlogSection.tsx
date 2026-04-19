import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sanityClient, urlFor, BlogPost, CATEGORY_LABELS } from "@/lib/sanity";
import { PortableTextRenderer } from "./PortableTextRenderer";

const QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, slug, excerpt, category, tags, coverImage, publishedAt, readingTimeMinutes, body
}`;

const CATEGORIES = ["all", "ml", "quantum", "iiser", "programming", "other"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    sanityClient
      .fetch<BlogPost[]>(QUERY)
      .then((data) => setPosts(data || []))
      .catch((err) => console.error("Sanity blog fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center">Blog</h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Notes on ML, quantum computing, and life at IISER Kolkata
        </p>

        {/* Filter chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === c
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "glass text-muted-foreground hover:text-primary"
              }`}
            >
              {c === "all" ? "All Posts" : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading posts…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet in this category.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setOpenPost(post)}
                className="glass rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:glow-primary transition-all"
              >
                {post.coverImage && (
                  <img
                    src={urlFor(post.coverImage).width(800).height(400).fit("crop").auto("format").url()}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    {post.category && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                    )}
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.readingTimeMinutes && <span>· {post.readingTimeMinutes} min read</span>}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs text-accent">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {openPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenPost(null)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-2xl max-w-3xl w-full my-8 overflow-hidden"
              >
                {openPost.coverImage && (
                  <img
                    src={urlFor(openPost.coverImage).width(1200).height(500).fit("crop").auto("format").url()}
                    alt={openPost.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-8">
                  <button
                    onClick={() => setOpenPost(null)}
                    className="float-right text-muted-foreground hover:text-primary text-2xl leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    {openPost.category && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {CATEGORY_LABELS[openPost.category] || openPost.category}
                      </span>
                    )}
                    <span>{formatDate(openPost.publishedAt)}</span>
                    {openPost.readingTimeMinutes && <span>· {openPost.readingTimeMinutes} min read</span>}
                  </div>
                  <h1 className="text-3xl font-bold gradient-text mb-6">{openPost.title}</h1>
                  {openPost.body && <PortableTextRenderer value={openPost.body} />}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BlogSection;
