import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (error) return NextResponse.redirect(new URL("/login?error=access_denied", baseUrl));
    if (!code || !state) return NextResponse.redirect(new URL("/login?error=invalid_request", baseUrl));

    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

    if (!appId || !appSecret || !redirectUri) throw new Error("Instagram OAuth credentials not configured");

    // Step 1: Exchange code for access token
    const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: appId, client_secret: appSecret, redirect_uri: redirectUri, code }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || tokenData.error) throw new Error(`Token exchange failed: ${tokenData.error?.message || "Unknown error"}`);

    const { access_token } = tokenData;

    // Step 2: Exchange for long-lived user token (page tokens from long-lived tokens never expire)
    const longLivedRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${access_token}`
    ).then((r) => r.json());
    const longLivedToken = longLivedRes.access_token || access_token;

    // Step 3: Get Facebook user info
    const meData = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${longLivedToken}`).then((r) => r.json());

    // Step 4: Get Facebook pages (page tokens from long-lived user token are permanent)
    const pagesData = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedToken}`).then((r) => r.json());

    let instagramAccountId = null;
    let pageAccessToken = access_token;
    let instagramUsername = null;

    if (pagesData.data && pagesData.data.length > 0) {
      const page = pagesData.data[0];

      // Fetch page token using long-lived user token so the page token is permanent
      const pageTokenRes = await fetch(
        `https://graph.facebook.com/v18.0/${page.id}?fields=access_token&access_token=${longLivedToken}`
      ).then((r) => r.json());
      pageAccessToken = pageTokenRes.access_token || page.access_token;

      // Step 4: Get Instagram Business Account
      const igData = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`).then((r) => r.json());

      if (igData.instagram_business_account) {
        instagramAccountId = igData.instagram_business_account.id;
        const accountData = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}?fields=id,username&access_token=${pageAccessToken}`).then((r) => r.json());
        instagramUsername = accountData.username || null;
      }
    }

    // Parse state: "login" or "connect:<email>"
    const decodedState = decodeURIComponent(state);
    const isLoginFlow = decodedState === "login";

    // Use Facebook email or fallback to facebook ID as email
    const userEmail = meData.email || `fb_${meData.id}@triggerflow.app`;
    const userName = meData.name || instagramUsername || "Instagram User";
    const userImage = meData.picture?.data?.url || null;

    // Upsert user with Instagram data
    await prisma.user.upsert({
      where: { email: isLoginFlow ? userEmail : decodedState },
      update: {
        ...(instagramAccountId && {
          instagramConnected: true,
          instagramAccessToken: pageAccessToken,
          instagramAccountId,
          instagramUsername: instagramUsername || "unknown",
          instagramAccountType: "BUSINESS",
          instagramConnectedAt: new Date(),
        }),
      },
      create: {
        email: isLoginFlow ? userEmail : decodedState,
        name: userName,
        image: userImage,
        ...(instagramAccountId && {
          instagramConnected: true,
          instagramAccessToken: pageAccessToken,
          instagramAccountId,
          instagramUsername: instagramUsername || "unknown",
          instagramAccountType: "BUSINESS",
          instagramConnectedAt: new Date(),
        }),
      },
    });

    if (isLoginFlow) {
      // Redirect to a special route that signs the user in via NextAuth credentials
      const params = new URLSearchParams({
        email: userEmail,
        name: userName,
        image: userImage || "",
      });
      return NextResponse.redirect(new URL(`/api/auth/instagram/signin?${params}`, baseUrl));
    }

    return NextResponse.redirect(new URL("/dashboard/instagram?success=connected", baseUrl));
  } catch (error: any) {
    console.error("Instagram OAuth callback error:", error);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }
}
