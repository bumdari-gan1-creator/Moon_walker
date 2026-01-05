import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  if (!title || !content) {
    return new Response(
      JSON.stringify({
        code: "1402",
        data: "Invalid data",
      })
    );
  }
  const res = await supabase.auth.getUser();
  const user = res.data.user;
  if (!user) {
    return new Response(
      JSON.stringify({
        code: "1401",
        data: "Not authenticated",
      })
    );
  }
  const insertRes = await supabase.from("posts").insert({
    title,
    content,
    user_id: user.id,
  });
  if (insertRes.error) {
    return new Response(
      JSON.stringify({
        code: "1500",
        data: insertRes.error.message,
      })
    );
  }
  return new Response(
    JSON.stringify({
      code: "0",
      data: "Success",
    })
  );
};
