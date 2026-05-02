import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, ExternalLink } from "lucide-react";

// Hand-curated arXiv papers Sankhadeep is reading / interested in.
// Edit IDs to update the reading list.
const ARXIV_IDS = [
  "1411.4028", // QAOA — Farhi
  "1706.03762", // Attention Is All You Need
  "1905.10876", // Expressibility & Entangling Capability
  "2010.11929", // ViT
  "2305.18290", // DPO
];

interface Paper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  published: string;
  url: string;
}

const stripNs = (s: string) => s.replace(/\s+/g, " ").trim();

const parseFeed = (xml: string): Paper[] => {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const entries = Array.from(doc.getElementsByTagName("entry"));
  return entries.map((e) => {
    const id = e.getElementsByTagName("id")[0]?.textContent || "";
    const title = stripNs(e.getElementsByTagName("title")[0]?.textContent || "");
    const summary = stripNs(e.getElementsByTagName("summary")[0]?.textContent || "");
    const published = e.getElementsByTagName("published")[0]?.textContent || "";
    const authors = Array.from(e.getElementsByTagName("author")).map(
      (a) => a.getElementsByTagName("name")[0]?.textContent || ""
    );
    return { id, title, authors, summary, published, url: id };
  });
};

const ArxivReadingList = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `https://export.arxiv.org/api/query?id_list=${ARXIV_IDS.join(",")}`;
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((xml) => setPapers(parseFeed(xml)))
      .catch((e) => setError(`arXiv API error (${e})`));
  }, []);

  return (
    <section id="reading" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <BookMarked className="w-7 h-7" /> arXiv Reading List
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-10">
          Papers I'm currently reading or revisiting · pulled live from arxiv.org
        </p>

        {error ? (
          <p className="text-center text-muted-foreground text-sm">{error}</p>
        ) : papers.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">Loading…</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {papers.map((p, i) => (
              <motion.a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 hover:-translate-y-1 hover:glow-primary transition-all block group"
              >
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm leading-snug flex-1">{p.title}</h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
                </div>
                <p className="text-[11px] text-primary mb-2 truncate">
                  {p.authors.slice(0, 3).join(", ")}
                  {p.authors.length > 3 && " et al."}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-3">{p.summary}</p>
                <p className="text-[10px] text-muted-foreground mt-3">
                  {new Date(p.published).getFullYear()} · arXiv:{p.id.split("/abs/")[1]?.split("v")[0]}
                </p>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArxivReadingList;