import React from "react";
import Link from "next/link";
import { connectDB } from "@/app/lib/mongodb";
import { AutomationRule } from "@/app/models/AutomationRule";
import { ProcessedComment } from "@/app/models/ProcessedComment";

const StatCard = ({
  label,
  value,
  subValue,
  subColor = "text-[#f05a28]"
}: {
  label: string;
  value: string;
  subValue: string;
  subColor?: string;
}) => (
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-[#00d4aa]/20 hover:bg-white/[0.06] transition-all group backdrop-blur-sm">
    <div className="flex flex-col">
      <span className="text-3xl font-black text-[#f0f4ff] mb-1 group-hover:scale-105 transition-transform origin-left">{value}</span>
      <span className="text-xs text-[#f0f4ff]/40 font-medium">{label}</span>
    </div>
    <div className={`text-[10px] font-bold flex items-center gap-1 ${subColor}`}>
      {subValue}
    </div>
  </div>
);

const ReelCard = ({
  title,
  keyword,
  triggers,
  status = "Active"
}: {
  title: string;
  keyword: string;
  triggers: number;
  status?: "Active" | "Paused";
}) => (
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.06] hover:border-[#00d4aa]/20 transition-all group backdrop-blur-sm">
    <div className="w-16 h-16 rounded-xl bg-[#f05a28]/10 border border-black/[0.06] flex items-center justify-center relative overflow-hidden flex-shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(240,90,40,0.4)" stroke="#f05a28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-[#f0f4ff] truncate mb-1">{title}</h4>
      <p className="text-[11px] text-[#f0f4ff]/40 font-medium leading-tight">
        Keyword: <span className="text-[#00d4aa]/70">"{keyword}"</span> • {triggers} triggers
      </p>
    </div>
    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${status === "Active" ? "bg-[#f05a28]/10 text-[#f05a28]" : "bg-black/[0.05] text-[#707070]"}`}>
      {status}
    </span>
  </div>
);

const ActivityItem = ({
  user,
  action,
  status,
  time,
  color = "bg-[#f05a28]"
}: {
  user: string;
  action: string;
  status: string;
  time: string;
  color?: string;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0">
    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${color}`} />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-[#f0f4ff]/50 leading-snug">
        <span className="font-bold text-[#f0f4ff]">@{user}</span> {action} • <span className="text-[#f0f4ff]/30 italic">{status}</span>
      </p>
    </div>
    <span className="text-[10px] text-[#f0f4ff]/25 font-medium whitespace-nowrap">{time}</span>
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
  
  const allRules = await AutomationRule.find({}, 'triggers repliesSent keyword reelUrl mediaId isActive sum').lean();
  
  let totalReplies = 0;
  let totalTriggers = 0;
  
  const activeRulesSorted = [];
  
  for (const rule of allRules as any[]) {
    totalReplies += (rule.repliesSent || 0);
    totalTriggers += (rule.triggers || 0);
    if (rule.isActive) {
      activeRulesSorted.push(rule);
    }
  }
  
  activeRulesSorted.sort((a, b) => b.triggers - a.triggers);
  const topActiveReels = activeRulesSorted.slice(0, 3);
  
  const successRate = totalTriggers > 0 ? Math.round((totalReplies / totalTriggers) * 100) : 0;
  
  const recentActivityRaw = await ProcessedComment.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('ruleId', 'keyword isActive')
    .lean();

  const recentActivity = recentActivityRaw.map((a: any) => {
    let uName = a.username;
    if (!uName || uName === "unknown_user" || uName === "unknown") {
      uName = a.dedupKey ? a.dedupKey.split(':')[0] : "unknown";
    }

    return {
      user: uName,
      action: `commented '${a.commentText || a.ruleId?.keyword || "..."}'`,
      status: a.ruleId?.isActive ? "reply sent" : "paused rule, skipped",
      time: timeAgo(new Date(a.createdAt)),
      color: a.ruleId?.isActive ? "bg-[#f05a28]" : "bg-black/20"
    };
  });

  return (
    <section className="cross-grid relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-2xl font-black text-[#f0f4ff] tracking-tight">Overview Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 flex items-center gap-3 backdrop-blur-sm">
              <div className="text-right">
                <p className="text-[10px] text-[#f0f4ff]/30 font-bold uppercase tracking-widest leading-none mb-1">Connected:</p>
                <p className="text-sm font-black text-[#f0f4ff] leading-none">triggerflow123</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#00d4aa]/15 flex items-center justify-center text-[10px] font-black text-[#00d4aa]">
                HC
              </div>
            </div>
            <Link href="/dashboard/create" className="text-[#0a0e1a] font-black text-sm px-6 py-3 rounded-full hover:-translate-y-0.5 transition-all active:translate-y-0 bg-[#00d4aa] shadow-[0_0_20px_rgba(0,212,170,0.3)]">
              + New automation
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard label="Active automations" value={activeAutomationsCount.toString()} subValue="Live now" subColor="text-[#00d4aa]" />
          <StatCard label="Triggers today" value={triggersTodayCount.toString()} subValue="Since midnight" subColor="text-[#00d4aa]" />
          <StatCard label="Replies sent" value={totalReplies.toString()} subValue={`${successRate}% success rate`} subColor="text-[#00d4aa]" />
          <StatCard label="Total all time" value={totalTriggers.toString()} subValue="All time triggers" subColor="text-[#f0f4ff]/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-[#f0f4ff] uppercase tracking-widest opacity-70">Active reels</h3>
              <Link href="/dashboard/automations" className="text-[10px] font-bold text-[#f0f4ff]/30 hover:text-[#00d4aa] transition-colors">See all →</Link>
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
                    />
                 ))
              ) : (
                <div className="text-xs text-[#f0f4ff]/30 font-medium bg-white/[0.04] p-4 border border-white/[0.07] rounded-xl text-center">
                  No active reels right now.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white/[0.04] border border-white/[0.08] rounded-3xl p-6 mt-11 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-[#f0f4ff] uppercase tracking-widest opacity-70">Recent activity</h3>
              <button className="text-[10px] font-bold text-[#f0f4ff]/30 hover:text-[#00d4aa] transition-colors">See all →</button>
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
                    color={activity.color} 
                  />
                ))
              ) : (
                <div className="text-xs text-[#f0f4ff]/30 font-medium py-4 text-center">
                  No recent activity found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
