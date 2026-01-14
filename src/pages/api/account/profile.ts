import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  const access = cookies.get("sb-access-token")?.value;
  const refresh = cookies.get("sb-refresh-token")?.value;
  if (!access || !refresh) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: access,
    refresh_token: refresh,
  });
  if (error || !data.user) {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await request.json();

  const res = await supabase.from("profiles").upsert({
    id: data.user.id,
    username: body.username ?? null,
    full_name: body.full_name ?? null,
    bio: body.bio ?? null,
    updated_at: new Date().toISOString(),
  });

  if (res.error) {
    return Response.json({ error: res.error.message }, { status: 400 });
  }

  return Response.json({ ok: true });
};
