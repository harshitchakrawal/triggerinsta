"use client";

import React from "react";
import Link from "next/link";
import { ReelCard } from "@/app/components/ReelCard";
import { useDark } from "@/app/lib/useDark";
import { backendUrl } from "@/app/lib/backend";

const StatCard = ({
  label,
  value,
  subValue,
  dark,
}: {
  label: string;
  value: string;
  subValue: string;
  dark: boolean;
}) => (
  <div className={`border rounded-2xl p-6 flex flex-col justify-between h-32 transition-all group backdrop-blur-sm ${
    dark 
      ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" 
      : "bg-white/60 border-[#0F0F0F]/[0.07] hover:bg-white/80 hover:border-[#0F0F0F]/10"
  }`}>
    <div className="flex flex-col">
      <span className={`text-3xl font-black mb-1 group-hover:scale-105 transition-transform origin-left [font-family:'Instrument_Serif',serif] ${
        dark ? "text-white" : "text-[#0F0F0F]"
      }`}>{value}</span>
      <span className={`text-xs font-medium ${dark ? "text-white/60" : "text-[#6B6660]"}`}>{label}</span>
    </div>
    <div className={`text-[10px] font-bold flex items-center gap-1 ${dark ? "text-white/60" : "text-[#6B6660]"}`}>
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
  dark,
}: {
  user: string;
  action: string;
  status: string;
  time: string;
  active?: boolean;
  dark: boolean;
}) => (
  <div className={`flex items-start gap-3 py-3 border-b last:border-0 ${
    dark ? "border-white/10" : "border-[#0F0F0F]/[0.05]"
  }`}>
    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
      active 
        ? dark ? "bg-white" : "bg-[#0F0F0F]" 
        : dark ? "bg-white/40" : "bg-[#6B6660]/40"
    }`} />
    <div className="flex-1 min-w-0">
      <p className={`text-xs leading-snug ${dark ? "text-white/60" : "text-[#6B6660]"}`}>
        <span className={`font-bold ${dark ? "text-white" : "text-[#0F0F0F]"}`}>@{user}</span> {action} • <span className={`italic ${dark ? "text-white/40" : "text-[#6B6660]/60"}`}>{status}</span>
      </p>
    </div>
    <span className={`text-[10px] font-medium whitespace-nowrap ${dark ? "text-white/30" : "text-[#6B6660]/50"}`}>{time}</span>
  </div>
);

export default function Dashboard() {
  const { dark } = useDark();

  const [data, setData] = React.useState({
    activeAutomationsCount: 0,
    triggersTodayCount: 0,
    totalReplies: 0,
    totalTriggers: 0,
    topActiveReels: [],
    recentActivity: [],
    successRate: 0
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(backendUrl("/dashboard"));
        if (response.ok) {
          const dashboardData = await response.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">

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
          <h1 className={`text-3xl font-normal tracking-tight [font-family:'Instrument_Serif',serif] ${
            dark ? "text-white" : "text-[#0F0F0F]"
          }`}>
            My automations
          </h1>
          <div className="flex items-center gap-4">
            <div className={`border rounded-xl px-4 py-2 flex items-center gap-3 backdrop-blur-sm ${
              dark 
                ? "bg-white/5 border-white/10" 
                : "bg-white/60 border-[#0F0F0F]/[0.07]"
            }`}>
              <div className="text-right">
                <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${
                  dark ? "text-white/60" : "text-[#6B6660]"
                }`}>Connected:</p>
                <p className={`text-sm font-bold leading-none ${
                  dark ? "text-white" : "text-[#0F0F0F]"
                }`}>TriggerInsta</p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                dark ? "bg-white/8 text-white" : "bg-[#0F0F0F]/8 text-[#0F0F0F]"
              }`}>
                HC
              </div>
            </div>
            <Link href="/dashboard/create" className={`font-medium text-sm px-6 py-3 rounded-full hover:-translate-y-0.5 transition-all active:translate-y-0 hover:opacity-85 ${
              dark ? "text-[#0F0F0F] bg-white" : "text-white bg-[#0F0F0F]"
            }`}>
              + New automation
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              dark ? "border-white" : "border-[#0F0F0F]"
            }`}></div>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <StatCard label="Active automations" value={data.activeAutomationsCount.toString()} subValue="Live now" dark={dark} />
              <StatCard label="Triggers today" value={data.triggersTodayCount.toString()} subValue="Since midnight" dark={dark} />
              <StatCard label="Replies sent" value={data.totalReplies.toString()} subValue={`${data.successRate}% success rate`} dark={dark} />
              <StatCard label="Total all time" value={data.totalTriggers.toString()} subValue="All time triggers" dark={dark} />
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xs font-bold uppercase tracking-widest opacity-50 ${
                    dark ? "text-white" : "text-[#0F0F0F]"
                  }`}>Active reels</h3>
                  <Link href="/dashboard/automations" className={`text-[10px] font-bold transition-colors ${
                    dark ? "text-white/60 hover:text-white" : "text-[#6B6660] hover:text-[#0F0F0F]"
                  }`}>See all →</Link>
                </div>
                <div className="space-y-3">
                  {data.topActiveReels.length > 0 ? (
                    data.topActiveReels.map((rule: any) => (
                      <ReelCard
                        key={rule.id || rule._id?.toString() || rule.mediaId}
                        title={rule.reelUrl || rule.mediaId || "Reel"}
                        keyword={rule.keyword}
                        triggers={rule.triggers || 0}
                        status={rule.isActive ? "Active" : "Paused"}
                        mediaId={rule.mediaId}
                      />
                    ))
                  ) : (
                    <div className={`text-xs font-medium p-4 border rounded-xl text-center ${
                      dark 
                        ? "text-white/60 bg-white/5 border-white/10" 
                        : "text-[#6B6660] bg-white/60 border-[#0F0F0F]/[0.07]"
                    }`}>
                      No active reels right now.
                    </div>
                  )}
                </div>
              </div>

              <div className={`lg:col-span-7 border rounded-3xl p-6 mt-11 backdrop-blur-sm ${
                dark 
                  ? "bg-white/5 border-white/10" 
                  : "bg-white/60 border-[#0F0F0F]/[0.07]"
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xs font-bold uppercase tracking-widest opacity-50 ${
                    dark ? "text-white" : "text-[#0F0F0F]"
                  }`}>Recent activity</h3>
                  <button className={`text-[10px] font-bold transition-colors ${
                    dark ? "text-white/60 hover:text-white" : "text-[#6B6660] hover:text-[#0F0F0F]"
                  }`}>See all →</button>
                </div>
                <div className="flex flex-col">
                  {data.recentActivity.length > 0 ? (
                    data.recentActivity.map((activity: any, index: number) => (
                      <ActivityItem
                        key={index}
                        user={activity.user}
                        action={activity.action}
                        status={activity.status}
                        time={activity.time}
                        active={activity.active}
                        dark={dark}
                      />
                    ))
                  ) : (
                    <div className={`text-xs font-medium py-4 text-center ${
                      dark ? "text-white/60" : "text-[#6B6660]"
                    }`}>
                      No recent activity found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
    </section>
  );
}
