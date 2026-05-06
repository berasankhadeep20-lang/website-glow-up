import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Loader2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamFromFunction } from "@/lib/streamChat";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Explain QAOA in two sentences",
  "Write a haiku about gradient descent",
  "Why is attention all you need?",
];

const LiveLLMDemo = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setError(null);
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      let acc = "";
      await streamFromFunction("llm-demo", { messages: next }, (chunk) => {
        acc += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="llm-demo" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Sparkles className="w-7 h-7" /> Live LLM Demo
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          A tiny chat powered by Lovable AI (Gemini 3 Flash). Ask anything.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div ref={scrollRef} className="h-80 overflow-y-auto p-5 scrollbar-thin space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground space-y-3">
                <p>Try one of these:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "gradient-bg text-primary-foreground"
                      : "bg-muted/50 text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.content === "" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> thinking…
              </div>
            )}
          </div>
          {error && <p className="px-5 pb-2 text-xs text-destructive">{error}</p>}
          <div className="border-t border-border/50 p-3 flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Ask the LLM anything..."
              className="flex-1 bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none max-h-32"
            />
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary"
                aria-label="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="gradient-bg text-primary-foreground px-3 py-2 rounded-lg disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveLLMDemo;