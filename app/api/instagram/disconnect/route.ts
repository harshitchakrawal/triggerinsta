import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          'instagram.isConnected': false,
          'instagram.accessToken': null,
          'instagram.accountId': null,
          'instagram.username': null,
          'instagram.accountType': null,
          'instagram.connectedAt': null,
        }
      }
    );

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error disconnecting Instagram:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
