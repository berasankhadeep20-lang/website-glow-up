const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PERSONAS: Record<string, string> = {
  recruiter:
    "You are explaining a project to a non-technical RECRUITER. Focus on business impact, scope, leadership/ownership signals, and outcomes. Avoid jargon. 4-6 short sentences.",
  researcher:
    "You are explaining a project to a fellow RESEARCHER. Emphasise methodology, novelty, datasets, evaluation, and limitations. Use precise technical language. 5-7 sentences.",
  developer:
    "You are explaining a project to a senior DEVELOPER. Focus on architecture, key engineering decisions, trade-offs, libraries, and how to extend it. Use code-savvy language. 5-7 sentences.",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { project, persona } = await req.json();
    if (!project?.title) {
      return new Response(JSON.stringify({ error: "project required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const personaPrompt = PERSONAS[persona] || PERSONAS.developer;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

    const ctx = `Project: ${project.title}\nDescription: ${project.longDesc || project.desc}\nTags: ${(project.tags || []).join(", ")}\nHighlights:\n- ${(project.highlights || []).join("\n- ")}\nRepo: ${project.url}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: personaPrompt + " Use markdown. Do not invent facts not present in the context." },
          { role: "user", content: ctx },
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