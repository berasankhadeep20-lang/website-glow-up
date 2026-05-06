import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// GET /og-image?slug=... &title=... &category=...
// Returns a redirect (302) to the cached PNG in storage. If missing, generates one
// via Lovable AI image gen, uploads to og-images bucket, then redirects.
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const slug = (url.searchParams.get("slug") || "").replace(/[^a-z0-9-_]/gi, "").slice(0, 80);
    const title = (url.searchParams.get("title") || "Sankhadeep's Blog").slice(0, 140);
    const category = (url.searchParams.get("category") || "").slice(0, 40);
    if (!slug) {
      return new Response(JSON.stringify({ error: "slug required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const path = `${slug}.png`;
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/og-images/${path}`;

    // Check cache: HEAD the public URL
    const head = await fetch(publicUrl, { method: "HEAD" });
    if (head.ok) {
      return Response.redirect(publicUrl, 302);
    }

    // Generate with Lovable AI image model
    const prompt = `Create a clean 1200x630 social-share OG card for a tech blog post.\nTitle: "${title}"\nCategory: ${category || "Tech notes"}\nAuthor: Sankhadeep Bera\nStyle: dark cosmic gradient (deep navy → magenta → cyan), abstract geometric shapes, glowing thin grid, subtle particle dust. Render the title prominently in large bold sans-serif (white). Render "Sankhadeep Bera · sankhadeep.dev" small at bottom-left. Render the category as a small pill at top-left. Modern editorial layout, high contrast, no clutter.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI image error", aiResp.status, t);
      // Fallback: redirect to default site OG
      return Response.redirect(
        "https://berasankhadeep20-lang.github.io/website-glow-up/og/f1-predictor.jpg",
        302,
      );
    }
    const data = await aiResp.json();
    const dataUrl: string | undefined = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl?.startsWith("data:image/")) {
      throw new Error("No image returned from AI");
    }
    const base64 = dataUrl.split(",")[1];
    const bin = Uint8Array.from(atob(base64), (ch) => ch.charCodeAt(0));

    const { error: upErr } = await supabase.storage
      .from("og-images")
      .upload(path, bin, { contentType: "image/png", upsert: true });
    if (upErr) {
      console.error("upload error", upErr);
      throw upErr;
    }

    return Response.redirect(publicUrl, 302);
  } catch (e) {
    console.error("og-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});