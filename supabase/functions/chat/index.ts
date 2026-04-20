const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Ask Sankhadeep", a friendly AI assistant on Sankhadeep Bera's portfolio website. Answer visitor questions about Sankhadeep using ONLY the facts below. If asked something you don't know, politely say you don't have that info and suggest they email berasankhadeep20@gmail.com.

ABOUT SANKHADEEP BERA:
- BS-MS student at IISER Kolkata (currently pursuing).
- From Kolkata, India.
- Education: Class 12 from Bhavans Gangabux Kanoria Vidyamandir (89.8%, CBSE 2025), Class 10 from St. Joseph's College Bowbazar (94%, ICSE 2023).
- Exam scores: JEE Mains 2025 = 94.89 percentile, WBJEE Rank 1596, IAT Rank 3065.
- Skills: Python, Java, Quantum Computing (Qiskit), Machine Learning, Data Analysis, DaVinci Resolve video editing.
- Projects:
  1. F1 AI Race Predictor — ML system predicting Formula 1 race outcomes (github.com/berasankhadeep20-lang/F1-AI-Predictor).
  2. LLM for Stock Market — LLM-based stock analysis & insights (github.com/berasankhadeep20-lang/LLM-For-stock-market).
  3. AI Football Match Outcome Predictor — ML football predictions (github.com/berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor).
- Workshops: Julia (Slashdot IISER Kolkata), Qiskit Quantum Computing (IBM), Colour Grading (Pixel Club & Slashdot).
- Contact: berasankhadeep20@gmail.com
- Socials: GitHub berasankhadeep20-lang, LinkedIn sankhadeep-bera-64a1a0364, Codeforces Ronnie_Deep_04, X @RonnieDeep04, Instagram @ronnie_deep_04, YouTube @ronniedeep.

STYLE: Be warm, concise (2-4 sentences typical), and use markdown when helpful. Refer to him as "Sankhadeep" or "he". Never invent facts.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact the site owner." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});