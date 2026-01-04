import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, cookies }) => {

  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );

  const access = cookies.get("sb-access-token")?.value;
  const refresh = cookies.get("sb-refresh-token")?.value;
  if (!access || !refresh) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
    access_token: access,
    refresh_token: refresh,
  });
  if (sessionErr || !sessionData.user) {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const content_md = String(body?.content_md ?? "").trim();
  if (!title || !content_md) {
    return Response.json({ error: "title, content_md required" }, { status: 400 });
  }

  const slug =
    String(body?.slug ?? title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") || crypto.randomUUID();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: sessionData.user.id,
      title,
      slug,
      content_md,
    })
    .select("id, slug")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ post: data }, { status: 201 });
};
