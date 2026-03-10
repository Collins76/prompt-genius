import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { method = "email", status = "success" } = body;

    // Extract IP from headers (Vercel/proxies set these)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    // Get user agent from the request headers (more reliable than client-sent)
    const userAgent = request.headers.get("user-agent") || "unknown";

    const { error } = await supabase.from("login_history").insert({
      user_id: user.id,
      ip_address: ip,
      user_agent: userAgent,
      method,
      status,
    });

    if (error) {
      console.error("Failed to track login:", error.message);
      return NextResponse.json({ error: "Failed to track login" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
