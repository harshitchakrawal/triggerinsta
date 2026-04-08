"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Automation {
  _id: string;
  mediaId: string;
  reelUrl?: string;
  keyword: string;
  replyToComment: string;
  replyToDM: string;
  isActive: boolean;
  triggers: number;
  repliesSent: number;
  lastTriggeredAt: string | null;
  createdAt: string;
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(240,90,40,0.4)" stroke="#f05a28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${active ? "bg-[#f05a28]" : "bg-gray-200"}`}
    >
      <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${active ? "left-[23px]" : "left-[3px]"}`} />
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full ${active ? "bg-[#f05a28]/10 text-[#f05a28]" : "bg-black/[0.05] text-navy"}`}>
      {active ? "Active" : "Paused"}
    </span>
  );
}

function Stat({ label, value, valueColor = "text-navy" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div>
      <div className={`text-base font-black leading-none ${valueColor}`}>{value}</div>
      <div className="text-[10px] font-bold text-navy mt-0.5 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function ActionBtn({ label, onClick, danger = false }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-bold px-4 py-2 rounded-lg border transition-all duration-150 cursor-pointer
        ${danger
          ? "border-black text-red-600 hover:border-red-300 hover:bg-red-50"
          : "border-black text-[#1a1a1a] hover:border-black/[0.15] hover:text-gray-400 hover:bg-black/[0.02]"
        }`}
    >
      {label}
    </button>
  );
}

function AutomationCard({
  automation,
  onToggle,
  onEdit,
  onPauseResume,
  onDelete,
}: {
  automation: Automation;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onPauseResume: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const keywords = automation.keyword.split(",").map((k) => k.trim());
  const addedDate = new Date(automation.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const successRate = automation.triggers > 0 ? Math.round((automation.repliesSent / automation.triggers) * 100) : 0;
  const lastTrigger = automation.lastTriggeredAt
    ? new Date(automation.lastTriggeredAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "Never";

  return (
    <div className="bg-white/70 border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 backdrop-blur-sm shadow-sm hover:border-black/[0.15] hover:bg-white/90">
      {/* Top row */}
      <div className="flex items-start gap-3.5">
        {/* Thumbnail */}
        <div className="w-13 h-13 rounded-xl bg-[#f05a28]/10 border border-black/[0.06] flex items-center justify-center flex-shrink-0 overflow-hidden">
          <PlayIcon />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className="m-0 text-base font-black text-[#1a1a1a] truncate">
              {automation.reelUrl || automation.mediaId}
            </h3>
            <div className="flex items-center gap-2.5">
              <StatusBadge active={automation.isActive} />
              <Toggle active={automation.isActive} onToggle={() => onToggle(automation._id)} />
            </div>
          </div>
          <p className="m-0 text-xs text-navy font-medium">
            {automation.mediaId} · Added {addedDate}
          </p>

          {/* Keywords */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {keywords.map((kw) => (
              <span key={kw} className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#f05a28]/15 text-[#f05a28] bg-[#f05a28]/5">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black" />

      {/* Stats + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-6">
          <Stat label="Triggers" value={String(automation.triggers)} />
          <Stat label="Replies sent" value={String(automation.repliesSent)} />
          <Stat
            label="Success"
            value={automation.triggers > 0 ? `${successRate}%` : "—"}
            valueColor={successRate === 100 ? "text-green-600" : successRate >= 85 ? "text-amber-600" : successRate > 0 ? "text-red-500" : "text-navy"}
          />
          <Stat label="Last trigger" value={lastTrigger} />
        </div>

        <div className="flex gap-2">
          <ActionBtn label="Edit" onClick={() => onEdit(automation._id)} />
          <ActionBtn label={automation.isActive ? "Pause" : "Resume"} onClick={() => onPauseResume(automation._id)} />
          <ActionBtn label="Delete" onClick={() => onDelete(automation._id)} danger />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#52525b]">
      <div className="text-4xl">⚙️</div>
      <p className="m-0 text-sm font-bold text-[#1a1a1a]">
        {filter === "All" ? "No automations yet" : `No ${filter.toLowerCase()} automations`}
      </p>
      <p className="m-0 text-xs text-navy font-medium">Create your first automation to get started</p>
      <Link
        href="/dashboard/create"
        className="mt-2 text-white font-black text-xs px-5 py-2.5 rounded-full hover:-translate-y-0.5 transition-all bg-[#f05a28] shadow-[0_4px_14px_rgba(240,90,40,0.3)]"
      >
        + New automation
      </Link>
    </div>
  );
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Active" | "Paused">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/rules")
      .then((r) => r.json())
      .then((data) => setAutomations(data.rules || []))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string) => {
    await fetch("/api/rules", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setAutomations((prev) => prev.map((a) => a._id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this automation?")) return;
    await fetch("/api/rules", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setAutomations((prev) => prev.filter((a) => a._id !== id));
  };

  const handleEdit = (id: string) => {
    window.location.href = `/dashboard/create?edit=${id}`;
  };

  const filtered = automations.filter((a) => {
    const matchFilter = filter === "All" || (filter === "Active" ? a.isActive : !a.isActive);
    const matchSearch = search.trim() === "" || a.mediaId.toLowerCase().includes(search.toLowerCase()) || a.keyword.toLowerCase().includes(search.toLowerCase()) || (a.reelUrl || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filterTabClass = (tab: string) =>
    `px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 border ${filter === tab ? "bg-[#f05a28] text-white border-[#f05a28]" : "bg-white/80 text-navy border-black/[0.07] hover:text-[#1a1a1a] backdrop-blur-sm"}`;

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f8f9fb] to-white" />
      <div className="dot-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_20%,rgba(255,255,255,0.8),transparent)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div>
            <h1 className="m-0 text-2xl font-black text-[#1a1a1a]">My automations</h1>
            <p className="m-0 mt-1 text-xs font-bold text-navy uppercase tracking-wide">
              {automations.length} rule{automations.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-black text-white bg-[#f05a28] shadow-[0_4px_20px_rgba(240,90,40,0.35)] hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            + New automation
          </Link>
        </div>

        {/* Filters + Search */}
        <div className="flex items-center gap-2.5 mb-6 flex-wrap">
          <button className={filterTabClass("All")} onClick={() => setFilter("All")}>All</button>
          <button className={filterTabClass("Active")} onClick={() => setFilter("Active")}>Active</button>
          <button className={filterTabClass("Paused")} onClick={() => setFilter("Paused")}>Paused</button>

          <div className="flex items-center gap-2 flex-1 max-w-xs ml-auto bg-white/80 border border-black/[0.07] rounded-lg px-3 backdrop-blur-sm">
            <span className="text-navy flex"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search by reel or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[#1a1a1a] text-sm py-2.5 w-full font-medium placeholder:text-[#bbb]"
            />
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-black/10 border-t-[#f05a28] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filtered.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              filtered.map((a) => (
                <AutomationCard
                  key={a._id}
                  automation={a}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onPauseResume={handleToggle}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
