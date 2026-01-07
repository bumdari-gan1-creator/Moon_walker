import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { authenticateUser, createErrorResponse } from "../../../lib/authMiddleware";
import { randomUUID } from "crypto";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const authResult = await authenticateUser(context);

  if (!authResult.success) {
    return createErrorResponse(authResult.error);
  }

  const user = authResult.user!;

  const formData = await context.request.formData();
  const title = formData.get("title");
  const content_md = formData.get("content");

  if (!title || !content_md) {
    return createErrorResponse({
      code: "1402",
      message: "Invalid data",
      status: 400,
    });
  }

  const slug = randomUUID();

  const insertRes = await supabase.from("posts").insert({
    title: title.toString(),
    content_md: content_md.toString(),
    author_id: user.id,
    slug: slug,
  });

  if (insertRes.error) {
    return createErrorResponse({
      code: "1500",
      message: insertRes.error.message,
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      code: "0",
      data: "Success",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
