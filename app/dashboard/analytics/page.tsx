"use client";

import React, { useEffect, useState } from "react";
import { useDark } from "@/app/lib/useDark";

interface AnalyticsData {
  days: { date: string; count: number }[];
  reelBreakdown: {
    mediaId: string;
    caption: string;
    keyword: string;
    triggers: number;
    repliesSent: number;
    isActive: boolean;
    successRate: number;
  }[];
  topCommenters: { username: string; count: number }[];
  totalTriggers: number;
  totalReplies: number;
  totalRules: number;
  activeRules: number;
  successRate: number;
}

function BarChart({ days, dark }: { days: { date: string; count: number }[]; dark: boolean }) {
  const max = Math.max(...days.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {days.map((d) => {
        const heightPct = (d.count / max) * 100;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
            <span className={`text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity ${dark ? "text-white/60" : "text-[#6B6660]"}`}>
              {d.count}
            </span>
            <div className="w-full flex items-end" style={{ height: "100px" }}>
              <div
                className={`w-full rounded-t-md transition-all duration-500 ${dark ? "bg-white/20 group-hover:bg-white/40" : "bg-[#0F0F0F]/10 group-hover:bg-[#0F0F0F]/25"}`}
                style={{ height: `${Math.max(heightPct, 4)}%` }}
              />
            </div>
            <span className={`text-[9px] font-medium ${dark ? "text-white/40" : "text-[#6B6660]/60"}`}>{d.date}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, sub, dark }: { label: string; value: string; sub?: string; dark: boolean }) {
  return (
    <div className={`border rounded-2xl p-6 flex flex-col gap-1 ${dark ? "bg-white/5 border-white/10" : "bg-white/60 border-[#0F0F0F]/[0.07]"}`}>
      <span className={`text-3xl font-black [font-family:'Instrument_Serif',serif] ${dark ? "text-white" : "text-[#0F0F0F]"}`}>{value}</span>
      <span className={`text-xs font-medium ${dark ? "text-white/60" : "text-[#6B6660]"}`}>{label}</span>
      {sub && <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-white/30" : "text-[#6B6660]/50"}`}>{sub}</span>}
    </div>
  );
}

export default function AnalyticsPage() {
  const { dark } = useDark();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const border = dark ? "border-white/10" : "border-[#0F0F0F]/[0.07]";
  const card = dark ? "bg-white/5 border-white/10" : "bg-white/60 border-[#0F0F0F]/[0.07]";
  const text = dark ? "text-white" : "text-[#0F0F0F]";
  const muted = dark ? "text-white/60" : "text-[#6B6660]";

  return (
    <section className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        <h1 className={`text-3xl font-normal tracking-tight mb-10 [font-family:'Instrument_Serif',serif] ${text}`}>
          Analytics
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className={`w-6 h-6 border-2 rounded-full animate-spin ${dark ? "border-white/20 border-t-white" : "border-[#0F0F0F]/10 border-t-[#0F0F0F]"}`} />
          </div>
        ) : !data ? (
          <p className={`text-sm ${muted}`}>Failed to load analytics.</p>
        ) : (
          <div className="space-y-8">

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total triggers" value={String(data.totalTriggers)} sub="All time" dark={dark} />
              <StatCard label="Replies sent" value={String(data.totalReplies)} sub="All time" dark={dark} />
              <StatCard label="Success rate" value={`${data.successRate}%`} sub="Replies / triggers" dark={dark} />
              <StatCard label="Active automations" value={`${data.activeRules} / ${data.totalRules}`} sub="Live now" dark={dark} />
            </div>

            {/* Bar chart */}
            <div className={`border rounded-2xl p-6 ${card}`}>
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-6 ${muted}`}>Triggers — last 7 days</h2>
              <BarChart days={data.days} dark={dark} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Per-reel breakdown */}
              <div className={`border rounded-2xl p-6 ${card}`}>
                <h2 className={`text-xs font-bold uppercase tracking-widest mb-5 ${muted}`}>Per-reel breakdown</h2>
                {data.reelBreakdown.length === 0 ? (
                  <p className={`text-sm ${muted}`}>No automations yet.</p>
                ) : (
                  <div className="space-y-4">
                    {data.reelBreakdown.map((r) => (
                      <div key={r.mediaId} className={`pb-4 border-b last:border-0 last:pb-0 ${border}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className={`text-sm font-medium line-clamp-1 ${text}`}>{r.caption}</p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${r.isActive ? (dark ? "bg-white/10 text-white" : "bg-[#0F0F0F]/8 text-[#0F0F0F]") : (dark ? "bg-white/5 text-white/40" : "bg-[#0F0F0F]/[0.04] text-[#6B6660]")}`}>
                            {r.isActive ? "Active" : "Paused"}
                          </span>
                        </div>
                        <div className="flex gap-5">
                          <div>
                            <p className={`text-base font-black [font-family:'Instrument_Serif',serif] ${text}`}>{r.triggers}</p>
                            <p className={`text-[10px] uppercase tracking-wide ${muted}`}>Triggers</p>
                          </div>
                          <div>
                            <p className={`text-base font-black [font-family:'Instrument_Serif',serif] ${text}`}>{r.repliesSent}</p>
                            <p className={`text-[10px] uppercase tracking-wide ${muted}`}>Replies</p>
                          </div>
                          <div>
                            <p className={`text-base font-black [font-family:'Instrument_Serif',serif] ${r.successRate === 100 ? "text-green-600" : r.successRate >= 80 ? "text-amber-600" : r.successRate > 0 ? "text-red-500" : text}`}>
                              {r.triggers > 0 ? `${r.successRate}%` : "—"}
                            </p>
                            <p className={`text-[10px] uppercase tracking-wide ${muted}`}>Success</p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        {r.triggers > 0 && (
                          <div className={`mt-3 h-1 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-[#0F0F0F]/[0.06]"}`}>
                            <div
                              className={`h-full rounded-full transition-all ${r.successRate === 100 ? "bg-green-500" : r.successRate >= 80 ? "bg-amber-500" : "bg-red-400"}`}
                              style={{ width: `${r.successRate}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top commenters */}
              <div className={`border rounded-2xl p-6 ${card}`}>
                <h2 className={`text-xs font-bold uppercase tracking-widest mb-5 ${muted}`}>Top commenters</h2>
                {data.topCommenters.length === 0 ? (
                  <p className={`text-sm ${muted}`}>No comment data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.topCommenters.map((c, i) => {
                      const maxCount = data.topCommenters[0].count;
                      return (
                        <div key={c.username} className="flex items-center gap-3">
                          <span className={`text-xs font-bold w-4 text-right flex-shrink-0 ${muted}`}>{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-medium ${text}`}>@{c.username}</span>
                              <span className={`text-xs font-bold ${muted}`}>{c.count}</span>
                            </div>
                            <div className={`h-1.5 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-[#0F0F0F]/[0.06]"}`}>
                              <div
                                className={`h-full rounded-full ${dark ? "bg-white/40" : "bg-[#0F0F0F]/30"}`}
                                style={{ width: `${(c.count / maxCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </section>
  );
}
