import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, cookies }) => {
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
  const password = body.password;

  if (!password || String(password).length < 6) {
    return Response.json({ error: "Password дор хаяж 6 тэмдэгт байх ёстой" }, { status: 400 });
  }

  const res = await supabase.auth.updateUser({ password: String(password) });
  if (res.error) {
    return Response.json({ error: res.error.message }, { status: 400 });
  }

  return Response.json({ ok: true });
};
