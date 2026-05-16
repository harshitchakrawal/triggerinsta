import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!user?.instagramConnected) return NextResponse.json({ error: "Instagram not connected" }, { status: 400 });

    const { instagramAccountId: accountId, instagramAccessToken: accessToken, instagramUsername: username, instagramAccountType: accountType } = user;

    const media: InstagramMedia[] = [];
    let endpoint: string | null =
      `https://graph.facebook.com/v18.0/${accountId}/media?` +
      `fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count&` +
      `limit=50&access_token=${accessToken}`;

    while (endpoint) {
      const res: Response = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) {
        const errorData: any = await res.json();
        if (errorData.error?.code === 190) {
          await prisma.user.update({ where: { email: session.user.email }, data: { instagramConnected: false } });
        }
        throw new Error(`Instagram API error: ${errorData.error?.message || res.statusText}`);
      }
      const data: any = await res.json();
      media.push(...(data.data || []));
      endpoint = data.paging?.next || null;
    }

    media.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ success: true, media, total: media.length, account: { username, accountType } });
  } catch (error: any) {
    console.error("Error fetching Instagram media:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch media" }, { status: 500 });
  }
}
