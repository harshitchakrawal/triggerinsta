import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

async function fetchMediaDetails(mediaId: string) {
  const accessToken = process.env.PAGE_ACCESS_TOKEN;
  if (!accessToken) throw new Error("PAGE_ACCESS_TOKEN not set");

  const url = `https://graph.facebook.com/v19.0/${mediaId}?fields=media_type,media_url,thumbnail_url,caption&access_token=${accessToken}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch media details");

  const thumbnail = data.media_type === "VIDEO" ? data.thumbnail_url : data.media_url;
  return { ...data, thumbnail };
}

export async function POST(req: Request) {
  try {
    const { mediaId, reelUrl, caption, keyword, replyToComment, replyToDm } = await req.json();

    if (!mediaId || !keyword || !replyToComment || !replyToDm) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let thumbnailUrl = null;

    try {
      const mediaDetails = await fetchMediaDetails(mediaId);
      thumbnailUrl = mediaDetails.media_type === "VIDEO" ? mediaDetails.thumbnail_url : mediaDetails.media_url;
    }
    catch (err: any) {
      console.error("Instagram fetch failed:", err.message);
    }

    const rule = await prisma.automationRule.create({
      data: { mediaId, reelUrl, thumbnailUrl, caption, keyword, replyToComment, replyToDM: replyToDm },
    });

    return NextResponse.json({ success: true, rule });
  } 
  catch (err: any) {
    console.error("[POST /api/rules]", err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Automation already exists for this mediaId" }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const edit = url.searchParams.get("edit");

    if (edit) {
      const rule = await prisma.automationRule.findUnique({ where: { id: edit } });
      if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ rule });
    }

    const rules = await prisma.automationRule.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ rules });
  } catch (err) {
    console.error("[GET /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    const rule = await prisma.automationRule.findUnique({ where: { id } });
    if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await prisma.automationRule.update({ where: { id }, data: { isActive: !rule.isActive } });
    return NextResponse.json({ success: true, rule: updated });
  } catch (err) {
    console.error("[PATCH /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, mediaId, reelUrl, caption, keyword, replyToComment, replyToDm } = await req.json();

    const updateData: any = { reelUrl, caption, keyword, replyToComment, replyToDM: replyToDm };

    if (mediaId) {
      try {
        const mediaDetails = await fetchMediaDetails(mediaId);
        updateData.mediaId = mediaId;
        updateData.thumbnailUrl = mediaDetails.media_type === "VIDEO" ? mediaDetails.thumbnail_url : mediaDetails.media_url;
      } catch (err: any) {
        console.error("Instagram fetch failed during update:", err.message);
      }
    }

    const rule = await prisma.automationRule.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, rule });
  } catch (err) {
    console.error("[PUT /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.automationRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
