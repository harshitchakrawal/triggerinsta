import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ isConnected: false, error: "Not authenticated" });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user?.instagram?.isConnected || !user.instagram.accessToken) {
      return NextResponse.json({ isConnected: false });
    }

    // Verify token is still valid
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${user.instagram.accountId}?fields=id,username,account_type&access_token=${user.instagram.accessToken}`
    );

    if (!res.ok) {
      await User.findOneAndUpdate(
        { email: session.user.email },
        { $set: { 'instagram.isConnected': false } }
      );
      return NextResponse.json({ isConnected: false, error: "Token expired" });
    }

    const accountInfo = await res.json();

    return NextResponse.json({
      isConnected: true,
      account: {
        id: accountInfo.id,
        username: accountInfo.username,
        accountType: accountInfo.account_type,
        connectedAt: user.instagram.connectedAt
      }
    });

  } catch (error: any) {
    console.error("Error checking Instagram status:", error);
    return NextResponse.json({ isConnected: false, error: error.message });
  }
}