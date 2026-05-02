import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the user email
    const error = searchParams.get('error');

    if (error) {
      console.error("Instagram OAuth error:", error);
      return NextResponse.redirect(new URL('/dashboard/instagram?error=access_denied', process.env.NEXTAUTH_URL));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/dashboard/instagram?error=invalid_request', process.env.NEXTAUTH_URL));
    }

    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

    if (!appId || !appSecret || !redirectUri) {
      throw new Error("Instagram OAuth credentials not configured");
    }

    // Step 1: Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      throw new Error(`Token exchange failed: ${error.error?.message || tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();

    // Step 2: Get user's Facebook pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${access_token}`
    );

    if (!pagesResponse.ok) {
      throw new Error("Failed to fetch Facebook pages");
    }

    const pagesData = await pagesResponse.json();
    
    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(new URL('/dashboard/instagram?error=no_pages', process.env.NEXTAUTH_URL));
    }

    // Step 3: Get Instagram Business Account from the first page
    const page = pagesData.data[0];
    const pageAccessToken = page.access_token;

    const instagramResponse = await fetch(
      `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );

    if (!instagramResponse.ok) {
      throw new Error("Failed to fetch Instagram account");
    }

    const instagramData = await instagramResponse.json();
    
    if (!instagramData.instagram_business_account) {
      return NextResponse.redirect(new URL('/dashboard/instagram?error=no_business_account', process.env.NEXTAUTH_URL));
    }

    const instagramAccountId = instagramData.instagram_business_account.id;

    // Step 4: Get Instagram account details
    const accountResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}?fields=id,username,account_type&access_token=${pageAccessToken}`
    );

    if (!accountResponse.ok) {
      throw new Error("Failed to fetch Instagram account details");
    }

    const accountData = await accountResponse.json();

    // Step 5: Save to database
    await connectDB();
    
    const user = await User.findOneAndUpdate(
      { email: state }, // state contains user email
      {
        $set: {
          'instagram.isConnected': true,
          'instagram.accessToken': pageAccessToken,
          'instagram.accountId': instagramAccountId,
          'instagram.username': accountData.username,
          'instagram.accountType': accountData.account_type,
          'instagram.connectedAt': new Date(),
        }
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    console.log(`Instagram connected for user: ${state}, account: ${accountData.username}`);

    // Redirect back to Instagram page with success
    return NextResponse.redirect(new URL('/dashboard/instagram?success=connected', process.env.NEXTAUTH_URL));

  } catch (error: any) {
    console.error("Instagram OAuth callback error:", error);
    return NextResponse.redirect(new URL(`/dashboard/instagram?error=${encodeURIComponent(error.message)}`, process.env.NEXTAUTH_URL));
  }
}