import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
}

export async function GET() {
  try {
    const activeAutomationsCount = await prisma.automationRule.count({ where: { isActive: true } });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const triggersTodayCount = await prisma.processedComment.count({ where: { createdAt: { gte: startOfToday } } });

    const allRules = await prisma.automationRule.findMany({
      select: { id: true, triggers: true, repliesSent: true, keyword: true, reelUrl: true, mediaId: true, isActive: true, thumbnailUrl: true, caption: true },
    });

    let totalReplies = 0;
    let totalTriggers = 0;
    const activeRules = [];

    for (const rule of allRules) {
      totalReplies += rule.repliesSent;
      totalTriggers += rule.triggers;
      if (rule.isActive) activeRules.push(rule);
    }

    activeRules.sort((a, b) => b.triggers - a.triggers);
    const topActiveReels = activeRules.slice(0, 3);
    const successRate = totalTriggers > 0 ? Math.round((totalReplies / totalTriggers) * 100) : 0;

    const recentActivityRaw = await prisma.processedComment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { rule: { select: { keyword: true, isActive: true } } },
    });

    const recentActivity = recentActivityRaw.map((a) => {
      let uName = a.username;
      if (!uName || uName === "unknown_user" || uName === "unknown") {
        uName = a.dedupKey ? a.dedupKey.split(":")[0] : "unknown";
      }
      return {
        user: uName,
        action: `commented '${a.commentText || a.rule?.keyword || "..."}'`,
        status: a.rule?.isActive ? "reply sent" : "paused rule, skipped",
        time: timeAgo(new Date(a.createdAt)),
        active: !!a.rule?.isActive,
      };
    });

    return NextResponse.json({
      activeAutomationsCount,
      triggersTodayCount,
      totalReplies,
      totalTriggers,
      topActiveReels,
      recentActivity,
      successRate,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
