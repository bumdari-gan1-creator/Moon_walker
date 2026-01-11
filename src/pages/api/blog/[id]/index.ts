import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );
}

async function requireUser(cookies: any) {
  const supabase = getSupabase();

  const access = cookies.get("sb-access-token")?.value;
  const refresh = cookies.get("sb-refresh-token")?.value;
  if (!access || !refresh) {
    return { supabase, user: null, resp: Response.json({ error: "Not logged in" }, { status: 401 }) };
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: access,
    refresh_token: refresh,
  });

  if (error || !data.user) {
    return { supabase, user: null, resp: Response.json({ error: "Invalid session" }, { status: 401 }) };
  }

  return { supabase, user: data.user, resp: null };
}

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const postId = params.id;
  if (!postId) return Response.json({ error: "Missing post id" }, { status: 400 });

  const { supabase, user, resp } = await requireUser(cookies);
  if (resp || !user) return resp!;

  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const content_md = String(body?.content_md ?? "").trim();

  if (!title || !content_md) {
    return Response.json({ error: "title, content_md required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .update({
      title,
      content_md,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .select("id")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ ok: true, post: data }, { status: 200 });
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const postId = params.id;
  if (!postId) return Response.json({ error: "Missing post id" }, { status: 400 });

  const { supabase, user, resp } = await requireUser(cookies);
  if (resp || !user) return resp!;

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return Response.json({ error: error.message }, { status: 400 });

  return Response.json({ ok: true }, { status: 200 });
};
