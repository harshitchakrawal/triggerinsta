import React from "react";
import Link from "next/link";
import { connectDB } from "@/app/lib/mongodb";
import { AutomationRule } from "@/app/models/AutomationRule";
import { ProcessedComment } from "@/app/models/ProcessedComment";
import { ReelCard } from "@/app/components/ReelCard";

const StatCard = ({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue: string;
}) => (
  <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl p-6 flex flex-col justify-between h-32 hover:bg-white/80 hover:border-[#0F0F0F]/10 transition-all group backdrop-blur-sm">
    <div className="flex flex-col">
      <span className="text-3xl font-black text-[#0F0F0F] mb-1 group-hover:scale-105 transition-transform origin-left [font-family:'Instrument_Serif',serif]">{value}</span>
      <span className="text-xs text-[#6B6660] font-medium">{label}</span>
    </div>
    <div className="text-[10px] font-bold text-[#6B6660] flex items-center gap-1">
      {subValue}
    </div>
  </div>
);

const ActivityItem = ({
  user,
  action,
  status,
  time,
  active = true,
}: {
  user: string;
  action: string;
  status: string;
  time: string;
  active?: boolean;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-[#0F0F0F]/[0.05] last:border-0">
    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${active ? "bg-[#0F0F0F]" : "bg-[#6B6660]/40"}`} />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-[#6B6660] leading-snug">
        <span className="font-bold text-[#0F0F0F]">@{user}</span> {action} • <span className="text-[#6B6660]/60 italic">{status}</span>
      </p>
    </div>
    <span className="text-[10px] text-[#6B6660]/50 font-medium whitespace-nowrap">{time}</span>
  </div>
);

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

export default async function Dashboard() {
  await connectDB();

  const activeAutomationsCount = await AutomationRule.countDocuments({ isActive: true });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const triggersTodayCount = await ProcessedComment.countDocuments({ createdAt: { $gte: startOfToday } });
console.log("hello")
console.log("hello")
console.log("hello")
console.log("checking something")
console.log("hello")

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

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8 bg-[#F4F1EB]">

      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1000] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-3xl font-normal text-[#0F0F0F] tracking-tight [font-family:'Instrument_Serif',serif]">
            My automations
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-xl px-4 py-2 flex items-center gap-3 backdrop-blur-sm">
              <div className="text-right">
                <p className="text-[10px] text-[#6B6660] font-bold uppercase tracking-widest leading-none mb-1">Connected:</p>
                <p className="text-sm font-bold text-[#0F0F0F] leading-none">triggerflow123</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0F0F0F]/8 flex items-center justify-center text-[10px] font-bold text-[#0F0F0F]">
                HC
              </div>
            </div>
            <Link href="/dashboard/create" className="text-white font-medium text-sm px-6 py-3 rounded-full hover:-translate-y-0.5 transition-all active:translate-y-0 bg-[#0F0F0F] hover:opacity-85">
              + New automation
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard label="Active automations" value={activeAutomationsCount.toString()} subValue="Live now" />
          <StatCard label="Triggers today" value={triggersTodayCount.toString()} subValue="Since midnight" />
          <StatCard label="Replies sent" value={totalReplies.toString()} subValue={`${successRate}% success rate`} />
          <StatCard label="Total all time" value={totalTriggers.toString()} subValue="All time triggers" />
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-[#0F0F0F] uppercase tracking-widest opacity-50">Active reels</h3>
              <Link href="/dashboard/automations" className="text-[10px] font-bold text-[#6B6660] hover:text-[#0F0F0F] transition-colors">See all →</Link>
            </div>
            <div className="space-y-3">
              {topActiveReels.length > 0 ? (
                topActiveReels.map((rule) => (
                  <ReelCard
                    key={rule._id?.toString() || rule.mediaId}
                    title={rule.reelUrl || rule.mediaId || "Reel"}
                    keyword={rule.keyword}
                    triggers={rule.triggers || 0}
                    status={rule.isActive ? "Active" : "Paused"}
                    thumbnailUrl={(rule as any).thumbnailUrl}
                  />
                ))
              ) : (
                <div className="text-xs text-[#6B6660] font-medium bg-white/60 p-4 border border-[#0F0F0F]/[0.07] rounded-xl text-center">
                  No active reels right now.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white/60 border border-[#0F0F0F]/[0.07] rounded-3xl p-6 mt-11 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-[#0F0F0F] uppercase tracking-widest opacity-50">Recent activity</h3>
              <button className="text-[10px] font-bold text-[#6B6660] hover:text-[#0F0F0F] transition-colors">See all →</button>
            </div>
            <div className="flex flex-col">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    user={activity.user}
                    action={activity.action}
                    status={activity.status}
                    time={activity.time}
                    active={activity.active}
                  />
                ))
              ) : (
                <div className="text-xs text-[#6B6660] font-medium py-4 text-center">
                  No recent activity found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
    </section>
  );
}
