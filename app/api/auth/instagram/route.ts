import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL));
    }

    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

    if (!appId || !redirectUri) {
      return NextResponse.redirect(new URL('/dashboard/instagram?error=not_configured', process.env.NEXTAUTH_URL));
    }

    const authUrl =
      `https://www.facebook.com/dialog/oauth?` +
      `client_id=${appId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_read_engagement,pages_show_list,business_management&` +
      `response_type=code&` +
      `state=${encodeURIComponent(session.user.email)}`;

    console.log('Auth URL:', authUrl);
    return NextResponse.redirect(authUrl);

  } catch (error) {
    console.error("Instagram OAuth error:", error);
    return NextResponse.redirect(new URL('/dashboard/instagram?error=oauth_failed', process.env.NEXTAUTH_URL));
  }
}