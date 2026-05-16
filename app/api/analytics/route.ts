import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    // Last 7 days triggers
    const days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      const count = await prisma.processedComment.count({ where: { createdAt: { gte: start, lte: end } } });
      days.push({ date: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count });
    }

    // Per-reel breakdown
    const rules = await prisma.automationRule.findMany({
      select: { mediaId: true, caption: true, reelUrl: true, keyword: true, triggers: true, repliesSent: true, isActive: true },
    });

    const reelBreakdown = rules
      .map((r) => ({
        mediaId: r.mediaId,
        caption: r.caption || r.reelUrl || r.mediaId,
        keyword: r.keyword,
        triggers: r.triggers,
        repliesSent: r.repliesSent,
        isActive: r.isActive,
        successRate: r.triggers > 0 ? Math.round((r.repliesSent / r.triggers) * 100) : 0,
      }))
      .sort((a, b) => b.triggers - a.triggers);

    // Top commenters
    const topCommentersRaw = await prisma.processedComment.groupBy({
      by: ["username"],
      where: { username: { notIn: ["unknown", "unknown_user"] } },
      _count: { username: true },
      orderBy: { _count: { username: "desc" } },
      take: 5,
    });

    const totalTriggers = rules.reduce((s, r) => s + r.triggers, 0);
    const totalReplies = rules.reduce((s, r) => s + r.repliesSent, 0);

    return NextResponse.json({
      days,
      reelBreakdown,
      topCommenters: topCommentersRaw.map((c) => ({ username: c.username ?? "unknown", count: c._count?.username ?? 0 })),
      totalTriggers,
      totalReplies,
      totalRules: rules.length,
      activeRules: rules.filter((r) => r.isActive).length,
      successRate: totalTriggers > 0 ? Math.round((totalReplies / totalTriggers) * 100) : 0,
    });
  } catch (error) {
    console.error("[GET /api/analytics]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
