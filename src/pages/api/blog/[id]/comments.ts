import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  const access = cookies.get("sb-access-token")?.value;
  const refresh = cookies.get("sb-refresh-token")?.value;
  if (!access || !refresh) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: s, error: se } = await supabase.auth.setSession({
    access_token: access,
    refresh_token: refresh,
  });
  if (se || !s.user) {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const text = String(body?.body ?? "").trim();
  if (!text) {
    return Response.json({ error: "comment body required" }, { status: 400 });
  }

  const post_id = params.id; 
  if (!post_id) {
    return Response.json({ error: "Missing post id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id,
      author_id: s.user.id,
      body: text,
    })
    .select("id, body, created_at")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ comment: data }, { status: 201 });
};
