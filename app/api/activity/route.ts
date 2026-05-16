import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";
    const csv = searchParams.get("csv") === "true";

    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { commentText: { contains: search, mode: "insensitive" } },
      ];
    }

    const raw = await prisma.processedComment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { rule: { select: { keyword: true, caption: true, reelUrl: true, mediaId: true, isActive: true } } },
    });

    const filtered = raw.filter((a) => {
      if (filter === "replied") return a.rule?.isActive;
      if (filter === "skipped") return !a.rule?.isActive;
      return true;
    });

    // CSV export
    if (csv) {
      const rows = [
        ["Username", "Comment", "Reel", "Keyword", "Status", "Date"].join(","),
        ...filtered.map((a) => [
          `@${a.username || "unknown"}`,
          `"${(a.commentText || "").replace(/"/g, "'")}"`,
          `"${(a.rule?.caption || a.rule?.mediaId || "").replace(/"/g, "'")}"`,
          a.rule?.keyword || "",
          a.rule?.isActive ? "Reply sent" : "Skipped (paused)",
          new Date(a.createdAt).toISOString(),
        ].join(",")),
      ].join("\n");

      return new Response(rows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=activity-log.csv",
        },
      });
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const activities = paginated.map((a) => ({
      id: a.id,
      username: a.username || "unknown",
      commentText: a.commentText || "",
      reel: a.rule?.caption || a.rule?.reelUrl || a.rule?.mediaId || "Unknown reel",
      keyword: a.rule?.keyword || "",
      status: a.rule?.isActive ? "replied" : "skipped",
      timeAgo: timeAgo(new Date(a.createdAt)),
      date: new Date(a.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    }));

    return NextResponse.json({ activities, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[GET /api/activity]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
