import type { APIContext } from "astro";
import { supabase } from "./supabase";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  [key: string]: any;
}

export interface AuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: {
    code: string;
    message: string;
    status: number;
  };
}


export async function authenticateUser(
  context: APIContext
): Promise<AuthResult> {
  const { cookies } = context;

  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return {
      success: false,
      error: {
        code: "1401",
        message: "Not authenticated",
        status: 401,
      },
    };
  }

  try {
    const session = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (session.error || !session.data.user) {
      return {
        success: false,
        error: {
          code: "1401",
          message: "Not authenticated",
          status: 401,
        },
      };
    }

    return {
      success: true,
      user: session.data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "1500",
        message:
          error instanceof Error ? error.message : "Internal server error",
        status: 500,
      },
    };
  }
}

export function createErrorResponse(error: AuthResult["error"]): Response {
  return new Response(
    JSON.stringify({
      code: error?.code || "1500",
      data: error?.message || "Internal server error",
    }),
    {
      status: error?.status || 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

