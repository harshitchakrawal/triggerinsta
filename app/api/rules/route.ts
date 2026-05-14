import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { AutomationRule } from "@/app/models/AutomationRule";
import { ProcessedComment } from "@/app/models/ProcessedComment";

async function fetchMediaDetails(mediaId: string) {
  const accessToken = process.env.PAGE_ACCESS_TOKEN;
  if (!accessToken) throw new Error('PAGE_ACCESS_TOKEN not set');

const url = `https://graph.facebook.com/v19.0/${mediaId}?fields=media_type,media_url,thumbnail_url,caption&access_token=${accessToken}`;

  const res = await fetch(url);
  const data = await res.json();

  console.log("INSTAGRAM RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to fetch media details');
  }

  // ✅ FIX HERE
  const thumbnail =
    data.media_type === "VIDEO"
      ? data.thumbnail_url
      : data.media_url;

  return {
    ...data,
    thumbnail
  };
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { mediaId, reelUrl, caption, keyword, replyToComment, replyToDm } = await req.json();

    // ✅ FIXED validation - check all required fields
    if (!mediaId || !keyword || !replyToComment || !replyToDm) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let thumbnailUrl = null;
    let finalCaption = caption;

    try {
      const mediaDetails = await fetchMediaDetails(mediaId);
      console.log("Media details fetched:", mediaDetails);

      thumbnailUrl =
        mediaDetails.media_type === "VIDEO"
          ? mediaDetails.thumbnail_url
          : mediaDetails.media_url;

      console.log("Thumbnail URL:", thumbnailUrl);

      if (!caption) {
        finalCaption = mediaDetails.caption;
      }

    } catch (err: any) {
      console.error("Instagram fetch failed:", err.message);
    }

    const rule = await AutomationRule.create({
      mediaId,
      reelUrl,
      thumbnailUrl,
      caption: finalCaption,
      keyword,
      replyToComment,
      replyToDM: replyToDm, // ✅ FIXED - use correct field name (uppercase M)
    });

    return NextResponse.json({ success: true, rule });

  } catch (err: any) {
    console.error("[POST /api/rules]", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Automation already exists for this mediaId" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Internal server error" },
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
      try {
        const mediaDetails = await fetchMediaDetails(mediaId);
        updateData.mediaId = mediaId;
        updateData.thumbnailUrl =
          mediaDetails.media_type === "VIDEO"
            ? mediaDetails.thumbnail_url
            : mediaDetails.media_url;
      } catch (err: any) {
        console.error("Instagram fetch failed during update:", err.message);
      }
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
    await ProcessedComment.deleteMany({ ruleId: id });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/rules]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
