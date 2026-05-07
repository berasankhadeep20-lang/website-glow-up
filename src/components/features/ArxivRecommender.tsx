import { useState } from "react";
import { Wand2, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const READING = [
  { id: "2605.00980", title: "Currently reading paper" },
  { id: "1411.4028", title: "QAOA — Farhi et al." },
  { id: "1706.03762", title: "Attention Is All You Need" },
  { id: "1905.10876", title: "Expressibility & Entangling Capability" },
  { id: "2010.11929", title: "Vision Transformer" },
  { id: "2305.18290", title: "DPO" },
];

interface Rec { title: string; arxiv_id: string; why: string }

const ArxivRecommender = () => {
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true); setErr(null);
    try {
      const { data, error } = await supabase.functions.invoke("arxiv-recommender", { body: { papers: READING } });
      if (error) throw error;
      setRecs(data.recommendations || []);
    } catch (e: any) {
      setErr(e.message || "Failed");
    } finally { setLoading(false); }
  };

  return (
    <section id="recommender" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Wand2 className="w-7 h-7" /> AI Paper Recommender
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Lovable AI scans my reading list and suggests 4 papers I'd enjoy next.
        </p>
        <div className="flex justify-center mb-6">
          <button onClick={generate} disabled={loading} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm flex items-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? "Thinking…" : "Recommend papers"}
          </button>
        </div>
        {err && <p className="text-center text-xs text-destructive">{err}</p>}
        <div className="grid md:grid-cols-2 gap-4">
          {recs.map((r, i) => (
            <a key={i} href={`https://arxiv.org/abs/${r.arxiv_id}`} target="_blank" rel="noopener noreferrer"
               className="glass rounded-xl p-4 hover:border-primary/50 transition-colors block">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold leading-tight">{r.title}</h3>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </div>
              <p className="text-[10px] font-mono text-primary mb-2">arXiv:{r.arxiv_id}</p>
              <p className="text-xs text-muted-foreground">{r.why}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArxivRecommender;