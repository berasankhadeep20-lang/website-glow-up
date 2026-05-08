const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const ids = url.searchParams.get("id_list");
    if (!ids) {
      return new Response(JSON.stringify({ error: "id_list required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const r = await fetch(`https://export.arxiv.org/api/query?id_list=${encodeURIComponent(ids)}`);
    const xml = await r.text();
    return new Response(xml, { headers: { ...corsHeaders, "Content-Type": "application/xml" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});