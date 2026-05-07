const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { papers } = await req.json();
    if (!Array.isArray(papers) || papers.length === 0) {
      return new Response(JSON.stringify({ error: "papers array required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const list = papers.map((p: any) => `- ${p.title} (${p.id})`).join("\n");
    const prompt = `Sankhadeep is reading these arXiv papers:\n${list}\n\nSuggest 4 NEW papers (not in the list) he would enjoy. Focus on quantum computing, ML, and physics. Return ONLY a JSON array of objects with keys: title, arxiv_id, why (1 sentence). No markdown.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return new Response(JSON.stringify({ error: t }), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    let parsed: any;
    try { parsed = JSON.parse(content); } catch { parsed = { recommendations: [] }; }
    const recs = Array.isArray(parsed) ? parsed : parsed.recommendations || parsed.papers || [];
    return new Response(JSON.stringify({ recommendations: recs }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});