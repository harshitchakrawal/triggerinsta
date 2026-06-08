import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ isConnected: false, error: "Not authenticated" });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!user?.instagramConnected || !user.instagramAccessToken) {
      return NextResponse.json({ isConnected: false });
    }

    return NextResponse.json({
      isConnected: true,
      account: {
        id: user.instagramAccountId,
        username: user.instagramUsername,
        accountType: user.instagramAccountType,
        connectedAt: user.instagramConnectedAt,
      },
    });
  } catch (error: any) {
    console.error("Error checking Instagram status:", error);
    return NextResponse.json({ isConnected: false, error: error.message });
  }
}
