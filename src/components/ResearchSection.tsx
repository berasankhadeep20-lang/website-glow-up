import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sanityClient, ResearchPaper } from "@/lib/sanity";

const QUERY = `*[_type == "researchPaper"] | order(featured desc, year desc) {
  _id, title, authors, abstract, venue, year, doi, arxivId, pdfUrl, externalUrl, bibtex, tags, featured
}`;

const ResearchSection = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    sanityClient
      .fetch<ResearchPaper[]>(QUERY)
      .then((data) => setPapers(data || []))
      .catch((err) => console.error("Sanity research fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const copyBibtex = (paper: ResearchPaper) => {
    if (!paper.bibtex) return;
    navigator.clipboard.writeText(paper.bibtex);
    setCopiedId(paper._id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length <= 3) return authors.join(", ");
    return `${authors.slice(0, 3).join(", ")}, et al.`;
  };

  return (
    <section id="research" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center">Research & Publications</h2>
        <p className="text-center text-muted-foreground text-sm mb-10">
          Papers, preprints, and academic work
        </p>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading publications…</p>
        ) : papers.length === 0 ? (
          <p className="text-center text-muted-foreground">No publications yet.</p>
        ) : (
          <ol className="space-y-5">
            {papers.map((paper, i) => {
              const isOpen = expanded === paper._id;
              return (
                <motion.li
                  key={paper._id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-6 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-primary/40 font-mono">
                      [{papers.length - i}]
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {paper.featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">{paper.year}</span>
                        {paper.venue && (
                          <span className="text-xs text-muted-foreground italic">· {paper.venue}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground leading-snug mb-1">{paper.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{formatAuthors(paper.authors)}</p>

                      {/* Action links */}
                      <div className="flex flex-wrap gap-2 text-xs mt-3">
                        {paper.pdfUrl && (
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            📄 PDF
                          </a>
                        )}
                        {paper.arxivId && (
                          <a
                            href={`https://arxiv.org/abs/${paper.arxivId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full border border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            arXiv:{paper.arxivId}
                          </a>
                        )}
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-primary transition-colors"
                          >
                            DOI
                          </a>
                        )}
                        {paper.externalUrl && (
                          <a
                            href={paper.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-primary transition-colors"
                          >
                            Publisher ↗
                          </a>
                        )}
                        <button
                          onClick={() => setExpanded(isOpen ? null : paper._id)}
                          className="px-3 py-1 rounded-full text-muted-foreground hover:text-primary transition-colors"
                        >
                          {isOpen ? "Hide details" : "Show abstract"}
                        </button>
                        {paper.bibtex && (
                          <button
                            onClick={() => copyBibtex(paper)}
                            className="px-3 py-1 rounded-full text-muted-foreground hover:text-primary transition-colors"
                          >
                            {copiedId === paper._id ? "✓ Copied!" : "Copy BibTeX"}
                          </button>
                        )}
                      </div>

                      {/* Expanded abstract + bibtex */}
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-border/50 space-y-3"
                        >
                          <div>
                            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                              Abstract
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{paper.abstract}</p>
                          </div>
                          {paper.bibtex && (
                            <div>
                              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                                BibTeX
                              </h4>
                              <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto font-mono text-foreground/80">
                                {paper.bibtex}
                              </pre>
                            </div>
                          )}
                          {paper.tags && paper.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {paper.tags.map((t) => (
                                <span key={t} className="text-xs text-accent">#{t}</span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
};

export default ResearchSection;
