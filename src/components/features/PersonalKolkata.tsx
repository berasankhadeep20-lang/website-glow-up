import { useEffect, useState } from "react";
import { Languages, Sparkles, BookHeart } from "lucide-react";

const COPY = {
  en: { title: "Personal Corner", sub: "A little bit of Kolkata, books, and seasonal joy.", books: "Books on my shelf", festival: "Festival mode" },
  bn: { title: "ব্যক্তিগত কোণ", sub: "একটু কলকাতা, বই, আর উৎসবের আনন্দ।", books: "আমার বইয়ের তাকে", festival: "উৎসব মোড" },
};

const BOOKS = [
  { title: "The Feynman Lectures Vol. III", author: "R. P. Feynman", tag: "Quantum" },
  { title: "Quantum Computation and Quantum Information", author: "Nielsen & Chuang", tag: "Reference" },
  { title: "Surely You're Joking, Mr. Feynman!", author: "R. P. Feynman", tag: "Memoir" },
  { title: "Sapiens", author: "Yuval Noah Harari", tag: "Non-fiction" },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", tag: "CS" },
  { title: "Aranyak", author: "Bibhutibhushan", tag: "Bengali" },
];

const detectFestival = () => {
  const m = new Date().getMonth();
  if (m === 9) return { name: "Durga Puja", emojis: ["🪔", "🌺", "🥁"] }; // October
  if (m === 10) return { name: "Diwali", emojis: ["🪔", "✨", "🎆"] }; // November
  if (m === 2) return { name: "Holi", emojis: ["🎨", "🌈", "💐"] }; // March
  return null;
};

const PersonalKolkata = () => {
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [festival] = useState(detectFestival);
  const [floaters, setFloaters] = useState<{ id: number; emoji: string; left: number; delay: number }[]>([]);

  useEffect(() => {
    if (!festival) return;
    const items = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      emoji: festival.emojis[i % festival.emojis.length],
      left: Math.random() * 100,
      delay: Math.random() * 6,
    }));
    setFloaters(items);
  }, [festival]);

  const t = COPY[lang];

  return (
    <section id="personal" className="py-24 px-6 relative overflow-hidden">
      {festival && (
        <div className="absolute inset-0 pointer-events-none">
          {floaters.map((f) => (
            <span
              key={f.id}
              className="absolute text-2xl opacity-60 animate-[float_8s_linear_infinite]"
              style={{ left: `${f.left}%`, bottom: "-40px", animationDelay: `${f.delay}s` }}
            >
              {f.emoji}
            </span>
          ))}
        </div>
      )}
      <style>{`@keyframes float { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:.7} 100%{transform:translateY(-110vh) rotate(360deg);opacity:0} }`}</style>

      <div className="max-w-5xl mx-auto relative">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-3xl font-bold gradient-text text-center">{t.title}</h2>
          <button onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))} className="px-2 py-1 rounded-full glass text-[10px] flex items-center gap-1">
            <Languages className="w-3 h-3" /> {lang === "en" ? "বাংলা" : "EN"}
          </button>
        </div>
        <p className="text-center text-muted-foreground text-sm mb-6">{t.sub}</p>

        {festival && (
          <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-center gap-3 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{t.festival}: <strong>{festival.name}</strong> {festival.emojis.join(" ")}</span>
          </div>
        )}

        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><BookHeart className="w-4 h-4" /> {t.books}</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {BOOKS.map((b) => (
              <div key={b.title} className="rounded-xl bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                <div className="text-sm font-medium leading-tight">{b.title}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{b.author}</div>
                <div className="text-[9px] uppercase tracking-wider text-primary mt-2">{b.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalKolkata;