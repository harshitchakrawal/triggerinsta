import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { AutomationRule } from "@/app/models/AutomationRule";
import { ProcessedComment } from "@/app/models/ProcessedComment";

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.max(0, Math.floor(seconds)) + "s ago";
}

export async function GET() {
  try {
    await connectDB();

    const activeAutomationsCount = await AutomationRule.countDocuments({ isActive: true });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const triggersTodayCount = await ProcessedComment.countDocuments({ createdAt: { $gte: startOfToday } });
    const allRules = await AutomationRule.find({}, "triggers repliesSent keyword reelUrl mediaId isActive thumbnailUrl").lean();

    let totalReplies = 0;
    let totalTriggers = 0;
    const activeRulesSorted = [];

    for (const rule of allRules as any[]) {
      totalReplies += rule.repliesSent || 0;
      totalTriggers += rule.triggers || 0;
      if (rule.isActive) activeRulesSorted.push(rule);
    }

    activeRulesSorted.sort((a, b) => b.triggers - a.triggers);
    const topActiveReels = activeRulesSorted.slice(0, 3);
    const successRate = totalTriggers > 0 ? Math.round((totalReplies / totalTriggers) * 100) : 0;

    const recentActivityRaw = await ProcessedComment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("ruleId", "keyword isActive")
      .lean();

    const recentActivity = recentActivityRaw.map((a: any) => {
      let uName = a.username;
      if (!uName || uName === "unknown_user" || uName === "unknown") {
        uName = a.dedupKey ? a.dedupKey.split(":")[0] : "unknown";
      }
      return {
        user: uName,
        action: `commented '${a.commentText || a.ruleId?.keyword || "..."}'`,
        status: a.ruleId?.isActive ? "reply sent" : "paused rule, skipped",
        time: timeAgo(new Date(a.createdAt)),
        active: !!a.ruleId?.isActive,
      };
    });

    return NextResponse.json({
      activeAutomationsCount,
      triggersTodayCount,
      totalReplies,
      totalTriggers,
      topActiveReels,
      recentActivity,
      successRate
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}