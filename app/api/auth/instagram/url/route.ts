import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const flow = searchParams.get("flow") || "login"; // "login" or "connect"
  const email = searchParams.get("email") || "";

  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return NextResponse.json({ error: "Instagram not configured" }, { status: 500 });
  }

  const state = flow === "login" ? "login" : encodeURIComponent(email);

  const url = new URL("https://www.facebook.com/v18.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_comments,public_profile,email");
  url.searchParams.set("response_type", "code");

  return NextResponse.json({ url: url.toString() });
}
