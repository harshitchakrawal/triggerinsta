import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        instagramConnected: false,
        instagramAccessToken: null,
        instagramAccountId: null,
        instagramUsername: null,
        instagramAccountType: null,
        instagramConnectedAt: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error disconnecting Instagram:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
