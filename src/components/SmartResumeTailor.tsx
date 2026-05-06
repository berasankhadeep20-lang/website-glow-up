import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamFromFunction } from "@/lib/streamChat";

const SmartResumeTailor = () => {
  const [jd, setJd] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tailor = async () => {
    if (jd.trim().length < 30) {
      setError("Paste a job description (at least 30 characters).");
      return;
    }
    setError(null);
    setOutput("");
    setLoading(true);
    try {
      await streamFromFunction("resume-tailor", { jobDescription: jd }, (c) =>
        setOutput((prev) => prev + c),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 mt-10 max-w-2xl mx-auto text-left"
    >
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-primary" /> Smart Resume Tailoring
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
        Paste a job description — AI rewrites Sankhadeep's bullets to mirror the role's keywords (only using verified facts).
      </p>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste job description here..."
        rows={6}
        maxLength={6000}
        className="w-full bg-muted/40 border border-border rounded-lg p-3 text-sm outline-none focus:border-primary resize-y"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-muted-foreground">{jd.length}/6000</span>
        <button
          onClick={tailor}
          disabled={loading}
          className="gradient-bg text-primary-foreground text-sm px-4 py-2 rounded-full font-semibold inline-flex items-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Tailoring…" : "Tailor my bullets"}
        </button>
      </div>
      {error && <p className="text-xs text-destructive mt-3">{error}</p>}
      {output && (
        <div className="mt-4 relative">
          <button
            onClick={copy}
            className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 px-2 py-1 rounded glass"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <div className="prose prose-sm prose-invert max-w-none bg-muted/30 rounded-lg p-4 text-sm">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SmartResumeTailor;