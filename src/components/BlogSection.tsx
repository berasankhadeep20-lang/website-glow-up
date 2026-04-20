import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { sanityClient, urlFor, BlogPost, CATEGORY_LABELS } from "@/lib/sanity";

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
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/blog/${post.slug.current}`}
                  className="glass rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:glow-primary transition-all block"
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
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
