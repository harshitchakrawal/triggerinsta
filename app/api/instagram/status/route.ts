import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

export async function GET() {
  try {
    const session = await auth();
    console.log('Status check session:', session?.user?.email);
    
    if (!session?.user?.email) {
      return NextResponse.json({ isConnected: false, error: "Not authenticated" });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    console.log('User found:', user?.email, 'instagram:', user?.instagram?.isConnected);

    if (!user?.instagram?.isConnected || !user.instagram.accessToken) {
      return NextResponse.json({ isConnected: false });
    }

    return NextResponse.json({
      isConnected: true,
      account: {
        id: user.instagram.accountId,
        username: user.instagram.username,
        accountType: user.instagram.accountType,
        connectedAt: user.instagram.connectedAt
      }
    });

  } catch (error: any) {
    console.error("Error checking Instagram status:", error);
    return NextResponse.json({ isConnected: false, error: error.message });
  }
}