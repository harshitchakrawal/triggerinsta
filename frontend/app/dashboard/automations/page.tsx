"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDark } from "@/app/lib/useDark";
import { backendUrl } from "@/app/lib/backend";

interface Automation {
  id: string;
  _id?: string;
  mediaId: string;
  reelUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  keyword: string;
  replyToComment: string;
  replyToDM: string;
  isActive: boolean;
  triggers: number;
  repliesSent: number;
  lastTriggeredAt: string | null;
  createdAt: string;
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${active ? "bg-[#0F0F0F]" : "bg-[#0F0F0F]/20"}`}>
      <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${active ? "left-[23px]" : "left-[3px]"}`} />
    </button>
  );
}

function StatusBadge({ active, dark }: { active: boolean; dark: boolean }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
      active
        ? dark
          ? "bg-white/10 text-white border-white/20"
          : "bg-[#0F0F0F]/8 text-[#0F0F0F] border-[#0F0F0F]/10"
        : dark
          ? "bg-white/[0.04] text-white/50 border-white/[0.07]"
          : "bg-[#0F0F0F]/[0.04] text-[#6B6660] border-[#0F0F0F]/[0.07]"
    }`}>
      {active ? "Active" : "Paused"}
    </span>
  );
}

function Stat({ label, value, valueColor, dark }: { label: string; value: string; valueColor?: string; dark: boolean }) {
  return (
    <div>
      <div className={`text-base font-black leading-none [font-family:'Instrument_Serif',serif] ${valueColor || (dark ? "text-white" : "text-[#0F0F0F]")}`}>{value}</div>
      <div className={`text-[10px] font-medium mt-0.5 uppercase tracking-wide ${dark ? "text-white/50" : "text-[#6B6660]"}`}>{label}</div>
    </div>
  );
}

function ActionBtn({ label, onClick, danger = false, dark }: { label: string; onClick: () => void; danger?: boolean; dark: boolean }) {
  return (
    <button onClick={onClick}
      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-150 cursor-pointer ${
        danger
          ? dark
            ? "border-white/10 text-red-400 hover:border-red-400/40 hover:bg-red-400/10"
            : "border-[#0F0F0F]/10 text-red-500 hover:border-red-300 hover:bg-red-50"
          : dark
            ? "border-white/10 text-white/50 hover:border-white/20 hover:text-white hover:bg-white/[0.04]"
            : "border-[#0F0F0F]/10 text-[#6B6660] hover:border-[#0F0F0F]/20 hover:text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.04]"
      }`}>
      {label}
    </button>
  );
}

function AutomationCard({ automation, onToggle, onEdit, onPauseResume, onDelete, dark }: {
  automation: Automation;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onPauseResume: (id: string) => void;
  onDelete: (id: string) => void;
  dark: boolean;
}) {
  const keywords = automation.keyword.split(",").map((k) => k.trim());
  const addedDate = new Date(automation.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const successRate = automation.triggers > 0 ? Math.round((automation.repliesSent / automation.triggers) * 100) : 0;
  const lastTrigger = automation.lastTriggeredAt
    ? new Date(automation.lastTriggeredAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "Never";

  const successColor = successRate === 100
    ? "text-green-400"
    : successRate >= 85
      ? "text-amber-400"
      : successRate > 0
        ? "text-red-400"
        : dark ? "text-white" : "text-[#0F0F0F]";

  return (
    <div className={`border rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 backdrop-blur-sm ${
      dark
        ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
        : "bg-white/60 border-[#0F0F0F]/[0.07] hover:border-[#0F0F0F]/10 hover:bg-white/80"
    }`}>
      <div className="flex items-start gap-3.5">
        <div className={`w-20 h-20 rounded-xl border flex items-center justify-center flex-shrink-0 overflow-hidden ${
          dark ? "bg-white/[0.04] border-white/[0.07]" : "bg-[#0F0F0F]/[0.04] border-[#0F0F0F]/[0.07]"
        }`}>
          {automation.mediaId ? (
            <img src={backendUrl(`/proxy-image?mediaId=${encodeURIComponent(automation.mediaId)}`)} alt="Thumbnail" className="w-full h-full object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={dark ? "rgba(255,255,255,0.1)" : "rgba(15,15,15,0.15)"} stroke={dark ? "#ffffff50" : "#6B6660"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className={`m-0 text-base font-bold truncate [font-family:'Instrument_Serif',serif] ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
              {automation.caption || automation.reelUrl || automation.mediaId}
            </h3>
            <div className="flex items-center gap-2.5">
              <StatusBadge active={automation.isActive} dark={dark} />
              <Toggle active={automation.isActive} onToggle={() => onToggle(automation.id || automation._id!)} />
            </div>
          </div>
          <p className={`m-0 text-xs font-medium ${dark ? "text-white/50" : "text-[#6B6660]"}`}>{automation.mediaId} · Added {addedDate}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {keywords.map((kw, i) => (
              <span key={`${kw}-${i}`} className={`text-[10px] font-medium px-2.5 py-1 rounded-sm border ${
                dark ? "border-white/10 text-white/60 bg-white/[0.04]" : "border-[#0F0F0F]/10 text-[#6B6660] bg-[#0F0F0F]/[0.04]"
              }`}>{kw}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={`h-px ${dark ? "bg-white/[0.07]" : "bg-[#0F0F0F]/[0.07]"}`} />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-6">
          <Stat label="Triggers" value={String(automation.triggers)} dark={dark} />
          <Stat label="Replies sent" value={String(automation.repliesSent)} dark={dark} />
          <Stat label="Success" value={automation.triggers > 0 ? `${successRate}%` : "—"} valueColor={successColor} dark={dark} />
          <Stat label="Last trigger" value={lastTrigger} dark={dark} />
        </div>
        <div className="flex gap-2">
          <ActionBtn label="Edit" onClick={() => onEdit(automation.id || automation._id!)} dark={dark} />
          <ActionBtn label={automation.isActive ? "Pause" : "Resume"} onClick={() => onPauseResume(automation.id || automation._id!)} dark={dark} />
          <ActionBtn label="Delete" onClick={() => onDelete(automation.id || automation._id!)} danger dark={dark} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filter, dark }: { filter: string; dark: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="text-4xl">⚙️</div>
      <p className={`m-0 text-sm font-normal [font-family:'Instrument_Serif',serif] ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
        {filter === "All" ? "No automations yet" : `No ${filter.toLowerCase()} automations`}
      </p>
      <p className={`m-0 text-xs font-medium ${dark ? "text-white/50" : "text-[#6B6660]"}`}>Create your first automation to get started</p>
      <Link href="/dashboard/create" className={`mt-2 font-medium text-xs px-5 py-2.5 rounded-full hover:-translate-y-0.5 transition-all ${
        dark ? "bg-white text-[#0F0F0F] hover:bg-white/90" : "bg-[#0F0F0F] text-white hover:opacity-85"
      }`}>+ New automation</Link>
    </div>
  );
}

export default function AutomationsPage() {
  const { dark } = useDark();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Active" | "Paused">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(backendUrl("/rules")).then((r) => r.json()).then((data) => setAutomations(data.rules || [])).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string) => {
    await fetch(backendUrl("/rules"), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setAutomations((prev) => prev.map((a) => (a.id || a._id) === id ? { ...a, isActive: !a.isActive } : a));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this automation?")) return;
    await fetch(backendUrl("/rules"), { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setAutomations((prev) => prev.filter((a) => (a.id || a._id) !== id));
  };

  const handleEdit = (id: string) => { window.location.href = `/dashboard/create?edit=${id}`; };

  const filtered = automations.filter((a) => {
    const matchFilter = filter === "All" || (filter === "Active" ? a.isActive : !a.isActive);
    const q = search.toLowerCase();
    const matchSearch = !q || a.mediaId.toLowerCase().includes(q) || a.keyword.toLowerCase().includes(q) || (a.caption || "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const filterTabClass = (tab: string) => {
    const isActive = filter === tab;
    if (isActive) return "px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-150 border bg-[#0F0F0F] text-white border-[#0F0F0F]";
    return `px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-150 border ${
      dark
        ? "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/20"
        : "bg-white/60 text-[#6B6660] border-[#0F0F0F]/[0.07] hover:text-[#0F0F0F]"
    }`;
  };

  return (
    <section className={`relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8 ${dark ? "bg-[#0F0F0F]" : "bg-[#F4F1EB]"}`}>
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div>
            <h1 className={`m-0 text-3xl font-normal [font-family:'Instrument_Serif',serif] ${dark ? "text-white" : "text-[#0F0F0F]"}`}>My automations</h1>
            <p className={`m-0 mt-1 text-xs font-medium uppercase tracking-wide ${dark ? "text-white/50" : "text-[#6B6660]"}`}>{automations.length} rule{automations.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/dashboard/create" className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium hover:-translate-y-0.5 transition-all active:translate-y-0 ${
            dark ? "bg-white text-[#0F0F0F] hover:bg-white/90" : "bg-[#0F0F0F] text-white hover:opacity-85"
          }`}>
            + New automation
          </Link>
        </div>

        <div className="flex items-center gap-2.5 mb-6 flex-wrap">
          <button className={filterTabClass("All")} onClick={() => setFilter("All")}>All</button>
          <button className={filterTabClass("Active")} onClick={() => setFilter("Active")}>Active</button>
          <button className={filterTabClass("Paused")} onClick={() => setFilter("Paused")}>Paused</button>
          <div className={`flex items-center gap-2 flex-1 max-w-xs ml-auto border rounded-full px-4 backdrop-blur-sm ${
            dark ? "bg-white/5 border-white/10" : "bg-white/60 border-[#0F0F0F]/[0.07]"
          }`}>
            <span className={dark ? "text-white/40" : "text-[#6B6660]"}><SearchIcon /></span>
            <input type="text" placeholder="Search by reel or keyword..." value={search} onChange={(e) => setSearch(e.target.value)}
              className={`bg-transparent border-none outline-none text-sm py-2.5 w-full font-medium ${
                dark ? "text-white placeholder:text-white/30" : "text-[#0F0F0F] placeholder:text-[#6B6660]/50"
              }`} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className={`w-6 h-6 border-2 rounded-full animate-spin ${dark ? "border-white/10 border-t-white/60" : "border-[#0F0F0F]/10 border-t-[#0F0F0F]"}`} />
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filtered.length === 0 ? <EmptyState filter={filter} dark={dark} /> : filtered.map((a) => (
              <AutomationCard key={a.id || a._id} automation={a} onToggle={handleToggle} onEdit={handleEdit} onPauseResume={handleToggle} onDelete={handleDelete} dark={dark} />
            ))}
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </section>
  );
}
