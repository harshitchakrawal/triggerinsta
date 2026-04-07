import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { AutomationRule } from "@/app/models/AutomationRule";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { mediaId, keyword, replyToComment, replyToDm } = await req.json();

    if (!mediaId || !keyword || !replyToComment || !replyToDm) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rule = await AutomationRule.create({
      mediaId,
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

export async function GET() {
  try {
    await connectDB();
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
