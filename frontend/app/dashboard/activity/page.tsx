"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDark } from "@/app/lib/useDark";
import { backendUrl } from "@/app/lib/backend";

interface Activity {
  id: string;
  username: string;
  commentText: string;
  reel: string;
  keyword: string;
  status: "replied" | "skipped";
  timeAgo: string;
  date: string;
}

type Filter = "all" | "replied" | "skipped";

export default function ActivityLogPage() {
  const { dark } = useDark();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), filter });
    if (search) params.set("search", search);
    const res = await fetch(backendUrl(`/activity?${params}`));
    const data = await res.json();
    setActivities(data.activities || []);
    setTotalPages(data.totalPages || 1);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, filter, search]);

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  // reset to page 1 on filter/search change
  useEffect(() => { setPage(1); }, [filter, search]);

  const handleExport = async () => {
    setExporting(true);
    const params = new URLSearchParams({ filter, csv: "true" });
    if (search) params.set("search", search);
    const res = await fetch(backendUrl(`/activity?${params}`));
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "activity-log.csv"; a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const text = dark ? "text-white" : "text-[#0F0F0F]";
  const muted = dark ? "text-white/60" : "text-[#6B6660]";
  const card = dark ? "bg-white/5 border-white/10" : "bg-white/60 border-[#0F0F0F]/[0.07]";
  const border = dark ? "border-white/[0.07]" : "border-[#0F0F0F]/[0.05]";

  const filterTabClass = (f: Filter) =>
    `px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all border ${
      filter === f
        ? dark ? "bg-white text-[#0F0F0F] border-white" : "bg-[#0F0F0F] text-white border-[#0F0F0F]"
        : dark ? "bg-white/5 text-white/60 border-white/10 hover:text-white" : "bg-white/60 text-[#6B6660] border-[#0F0F0F]/[0.07] hover:text-[#0F0F0F]"
    }`;

  return (
    <section className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className={`text-3xl font-normal tracking-tight [font-family:'Instrument_Serif',serif] ${text}`}>
              Activity log
            </h1>
            <p className={`text-xs font-medium uppercase tracking-widest mt-1 ${muted}`}>
              {total} total trigger{total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-full border transition-all disabled:opacity-50 ${
              dark ? "border-white/10 text-white/60 hover:text-white hover:border-white/20" : "border-[#0F0F0F]/10 text-[#6B6660] hover:text-[#0F0F0F] hover:border-[#0F0F0F]/20"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>

        {/* Filters + Search */}
        <div className="flex items-center gap-2.5 mb-6 flex-wrap">
          <button className={filterTabClass("all")} onClick={() => setFilter("all")}>All</button>
          <button className={filterTabClass("replied")} onClick={() => setFilter("replied")}>Reply sent</button>
          <button className={filterTabClass("skipped")} onClick={() => setFilter("skipped")}>Skipped</button>

          <div className={`flex items-center gap-2 flex-1 max-w-xs ml-auto border rounded-full px-4 backdrop-blur-sm ${dark ? "bg-white/5 border-white/10" : "bg-white/60 border-[#0F0F0F]/[0.07]"}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={muted}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by username or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`bg-transparent border-none outline-none text-sm py-2.5 w-full font-medium placeholder:opacity-40 ${text}`}
            />
          </div>
        </div>

        {/* Table */}
        <div className={`border rounded-2xl overflow-hidden ${card}`}>
          {/* Table header */}
          <div className={`grid grid-cols-12 gap-4 px-6 py-3 border-b text-[10px] font-bold uppercase tracking-widest ${muted} ${border}`}>
            <span className="col-span-2">User</span>
            <span className="col-span-3">Comment</span>
            <span className="col-span-3">Reel</span>
            <span className="col-span-1">Keyword</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-1 text-right">When</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className={`w-5 h-5 border-2 rounded-full animate-spin ${dark ? "border-white/20 border-t-white" : "border-[#0F0F0F]/10 border-t-[#0F0F0F]"}`} />
            </div>
          ) : activities.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-16 gap-2 ${muted}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <p className="text-sm">No activity found</p>
            </div>
          ) : (
            activities.map((a, i) => (
              <div
                key={a.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b last:border-0 transition-colors ${border} ${dark ? "hover:bg-white/[0.03]" : "hover:bg-[#0F0F0F]/[0.02]"}`}
              >
                <div className="col-span-2 flex items-center gap-2 min-w-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${dark ? "bg-white/10 text-white" : "bg-[#0F0F0F]/8 text-[#0F0F0F]"}`}>
                    {a.username[0]?.toUpperCase() || "?"}
                  </div>
                  <span className={`text-xs font-medium truncate ${text}`}>@{a.username}</span>
                </div>
                <div className="col-span-3 flex items-center min-w-0">
                  <span className={`text-xs truncate ${muted}`}>"{a.commentText}"</span>
                </div>
                <div className="col-span-3 flex items-center min-w-0">
                  <span className={`text-xs truncate ${muted}`}>{a.reel}</span>
                </div>
                <div className="col-span-1 flex items-center">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-sm border ${dark ? "border-white/10 text-white/50" : "border-[#0F0F0F]/10 text-[#6B6660]"}`}>
                    {a.keyword}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    a.status === "replied"
                      ? dark ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-700"
                      : dark ? "bg-white/5 text-white/30" : "bg-[#0F0F0F]/[0.04] text-[#6B6660]"
                  }`}>
                    {a.status === "replied" ? "✓ Reply sent" : "Skipped"}
                  </span>
                </div>
                <div className={`col-span-1 flex items-center justify-end text-[10px] font-medium ${muted}`}>
                  {a.timeAgo}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all disabled:opacity-30 ${dark ? "border-white/10 text-white/60 hover:text-white" : "border-[#0F0F0F]/10 text-[#6B6660] hover:text-[#0F0F0F]"}`}
            >
              ← Prev
            </button>
            <span className={`text-xs font-medium ${muted}`}>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all disabled:opacity-30 ${dark ? "border-white/10 text-white/60 hover:text-white" : "border-[#0F0F0F]/10 text-[#6B6660] hover:text-[#0F0F0F]"}`}
            >
              Next →
            </button>
          </div>
        )}

      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </section>
  );
}
