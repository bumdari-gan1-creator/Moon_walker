import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { createErrorResponse } from "../../../lib/authMiddleware";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const url = new URL(context.request.url);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    const limit = 10;

    if (isNaN(offset) || offset < 0) {
      return createErrorResponse({
        code: "1402",
        message: "Invalid offset parameter",
        status: 400,
      });
    }

    const { data: posts, error } = await supabase
      .from("posts")
      .select("created_at, title, author_id")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return createErrorResponse({
        code: "1500",
        message: error.message,
        status: 500,
      });
    }

    const result = (posts || []).map((post) => ({
      created_at: post.created_at,
      title: post.title,
      author_email: null,
    }));

    return new Response(
      JSON.stringify({
        code: "0",
        data: result,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return createErrorResponse({
      code: "1500",
      message: error instanceof Error ? error.message : "Internal server error",
      status: 500,
    });
  }
};

