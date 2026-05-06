const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESUME_FACTS = `
Sankhadeep Bera — BS-MS student, IISER Kolkata.
Skills: Python, Java, Quantum Computing (Qiskit), Machine Learning, Data Analysis, DaVinci Resolve.
Projects:
- F1 AI Race Predictor: gradient-boosted ML pipeline for race outcome forecasting; per-circuit feature engineering; backtested across multiple F1 seasons.
- LLM for Stock Market: combines structured market data with LLM analysis to summarise sentiment and produce explainable forecasts.
- AI Football Predictor: classification model with ELO ratings, recent form, isotonic probability calibration, multi-league training.
- Freight Rate Intelligence: zero-cost dashboard tracking BDRY/ZIM/XPO + FRED macros; SQLite store; WoW + Z-score alerts; Pearson correlation matrix; GitHub Actions cron.
Workshops: Julia (Slashdot IISER), Qiskit Quantum Computing (IBM), Colour Grading (Pixel Club & Slashdot).
Exam scores: JEE Mains 2025 94.89 percentile; WBJEE Rank 1596; IAT Rank 3065.
Education: Class 12 Bhavans 89.8% CBSE 2025; Class 10 St. Joseph's College Bowbazar 94% ICSE 2023.
`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { jobDescription } = await req.json();
    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.length < 30) {
      return new Response(JSON.stringify({ error: "Paste a job description (min 30 chars)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (jobDescription.length > 6000) {
      return new Response(JSON.stringify({ error: "Job description too long (max 6000 chars)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

    const sys = `You are a senior resume coach. Given the candidate facts and a target job description, produce a tailored set of 5-7 resume bullet points that match the JD's keywords and competencies. Rules:
- Use ONLY facts present in the candidate context. Never invent employers, dates, metrics or technologies.
- Lead each bullet with a strong action verb.
- Where the candidate facts already include a metric (%, rank, count), preserve it.
- Output STRICT markdown: a section "## Tailored Bullets" with a bulleted list, then "## Why this matches" with 2-3 short lines, then "## Keywords mirrored" with comma-separated keywords from the JD that appear in the bullets.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: `CANDIDATE FACTS:\n${RESUME_FACTS}\n\nJOB DESCRIPTION:\n${jobDescription}` },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429 || status === 402) {
        return new Response(
          JSON.stringify({ error: status === 429 ? "Rate limit reached." : "AI credits exhausted." }),
          { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});