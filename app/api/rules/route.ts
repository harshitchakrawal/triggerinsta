import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { AutomationRule } from "@/app/models/AutomationRule";

async function fetchMediaDetails(mediaId: string) {
  const accessToken = process.env.PAGE_ACCESS_TOKEN;
  if (!accessToken) throw new Error('PAGE_ACCESS_TOKEN not set');

  const res = await fetch(`https://graph.instagram.com/${mediaId}?fields=media_type,media_url,thumbnail_url,caption&access_token=${accessToken}`);
  if (!res.ok) throw new Error('Failed to fetch media details');

  const data = await res.json();
  return data;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { mediaId, reelUrl, caption, keyword, replyToComment, replyToDm } = await req.json();

    if (!mediaId || !keyword || !replyToComment || !replyToDm) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const mediaDetails = await fetchMediaDetails(mediaId);
    const thumbnailUrl = mediaDetails.thumbnail_url || mediaDetails.media_url;

    const rule = await AutomationRule.create({
      mediaId,
      reelUrl,
      thumbnailUrl,
      caption: caption || mediaDetails.caption,
      keyword,
      replyToComment,
      replyToDM: replyToDm,
    });

    return NextResponse.json({ success: true, rule });

  } catch (err: any) {
    console.error("[POST /api/rules]", err);

    // HANDLE DUPLICATE ERROR
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Automation already exists for this mediaId" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const edit = url.searchParams.get('edit');
    if (edit) {
      const rule = await AutomationRule.findById(edit);
      if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ rule });
    }
    const rules = await AutomationRule.find().sort({ createdAt: -1 });
    return NextResponse.json({ rules });
  } catch (err) {
    console.error("[GET /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    const rule = await AutomationRule.findById(id);
    if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });
    rule.isActive = !rule.isActive;
    await rule.save();
    return NextResponse.json({ success: true, rule });
  } catch (err) {
    console.error("[PATCH /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, mediaId, reelUrl, caption, keyword, replyToComment, replyToDm } = await req.json();
    const updateData: any = {
      reelUrl,
      caption,
      keyword,
      replyToComment,
      replyToDM: replyToDm
    };
    if (mediaId) {
      const mediaDetails = await fetchMediaDetails(mediaId);
      updateData.mediaId = mediaId;
      updateData.thumbnailUrl = mediaDetails.thumbnail_url || mediaDetails.media_url;
    }
    const rule = await AutomationRule.findByIdAndUpdate(id, updateData, { new: true });
    if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, rule });
  } catch (err) {
    console.error("[PUT /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    await AutomationRule.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
