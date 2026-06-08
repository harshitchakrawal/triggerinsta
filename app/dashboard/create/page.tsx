"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { backendUrl } from "@/app/lib/backend";
import { useDark } from "@/app/lib/useDark";

export default function CreateAutomation() {
  const { dark } = useDark();

  // --- CREATE mode state (only used when creating a new automation) ---
  const [reelUrl, setReelUrl] = useState("");
  const [mediaId, setMediaId] = useState("");
  const [caption, setCaption] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // --- Shared form state ---
  const [keywords, setKeywords] = useState<string[]>(["link"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [replyToComment, setreplyToComment] = useState("Hey! I just sent you the link in DMs — check your inbox!");
  const [replyToDm, setreplyToDm] = useState("Here's the resource you asked for: https://yourlink.com");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- EDIT mode state (fetched from DB, never mixed with create form state) ---
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [dbData, setDbData] = useState<{ mediaId: string; reelUrl: string; caption: string } | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const edit = urlParams.get("edit");
    const prefilledUrl = urlParams.get("reelUrl");

    if (edit) {
      setEditing(true);
      setEditId(edit);
      fetch(backendUrl("/rules?edit=" + edit)).then(r => r.json()).then(data => {
        const rule = data.rule;
        const fetched = { mediaId: rule.mediaId, reelUrl: rule.reelUrl || "", caption: rule.caption || "" };
        setDbData(fetched);
        setKeywords(rule.keyword.split(",").map((k: string) => k.trim()));
        setreplyToComment(rule.replyToComment);
        setreplyToDm(rule.replyToDM);
      });
    } else if (prefilledUrl) {
      handleUrlChange(prefilledUrl);
    }
  }, []);

  const handleUrlChange = async (url: string) => {
    setReelUrl(url); setMediaId(""); setCaption(""); setVerifyError("");
    const match = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (!match) return;
    setVerifying(true);
    try {
      const res = await fetch(backendUrl("/media/verify"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (data.success) { setMediaId(data.mediaId); setCaption(data.caption || ""); }
      else { setVerifyError(data.error); setMediaId(""); setCaption(""); }
    } catch { setVerifyError("Failed to verify URL"); }
    finally { setVerifying(false); }
  };

  const handleSave = async () => {
    if (!mediaId) { alert("Please enter a valid Instagram reel URL"); return; }
    if (keywords.length === 0) { alert("Please add at least one keyword"); return; }
    setLoading(true);
    try {
      const body = editing
        ? { id: editId, reelUrl: dbData?.reelUrl, caption: dbData?.caption, keyword: keywords.join(","), replyToComment, replyToDm }
        : { mediaId, reelUrl, caption, keyword: keywords.join(","), replyToComment, replyToDm };
      const res = await fetch(backendUrl("/rules"), { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); if (editing) window.location.href = "/dashboard/automations"; }
      else alert("Failed to save automation. Please try again.");
    } catch (error) { console.error("Save error:", error); alert("An error occurred while saving."); }
    finally { setLoading(false); }
  };

  const addKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newKeyword.trim()) {
      e.preventDefault();
      const kw = newKeyword.trim().toLowerCase();
      if (!keywords.includes(kw)) setKeywords([...keywords, kw]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) => setKeywords(keywords.filter((k) => k !== kw));

  const card = dark
    ? "bg-white/5 border-white/10 backdrop-blur-md"
    : "bg-white/60 border-[#0F0F0F]/[0.07] backdrop-blur-md";

  const divider = dark ? "bg-white/[0.07]" : "bg-[#0F0F0F]/[0.07]";
  const label = dark ? "text-white/50" : "text-[#6B6660]";
  const textPrimary = dark ? "text-white" : "text-[#0F0F0F]";
  const textMuted = dark ? "text-white/60" : "text-[#6B6660]";
  const textFaint = dark ? "text-white/30" : "text-[#6B6660]/60";
  const inputBorder = dark ? "border-white/10 focus:border-white/40" : "border-[#0F0F0F]/[0.08] focus:border-[#0F0F0F]/40";
  const placeholder = dark ? "placeholder:text-white/20" : "placeholder:text-[#6B6660]/40";

  return (
    <section className={`relative min-h-screen overflow-hidden py-10 ${dark ? "bg-[#0F0F0F]" : "bg-[#F4F1EB]"}`}>
      <div className="relative z-10 w-full pt-8 px-4 sm:px-6 lg:px-8">

        <Link href="/dashboard" className={`inline-flex items-center gap-2 transition-all mb-8 group ${dark ? "text-white/50 hover:text-white" : "text-[#6B6660] hover:text-[#0F0F0F]"}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        <div className="mb-12">
          <h1 className={`text-3xl font-normal tracking-tight mb-2 [font-family:'Instrument_Serif',serif] ${textPrimary}`}>
            {editing ? "Edit automation" : "Create automation"}
          </h1>
        </div>

        <div className="space-y-16 pb-20">

          {/* Section 1: Reel Details */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className={`text-xl font-normal mb-1 [font-family:'Instrument_Serif',serif] ${textPrimary}`}>Reel details</h2>
              <p className={`text-xs font-medium uppercase tracking-widest ${textMuted}`}>Paste your Instagram reel link — we extract the media ID automatically</p>
            </div>
            <div className="space-y-8">
              <div className={`border rounded-xl p-6 space-y-3 ${card}`}>
                <label className={`text-[10px] font-bold uppercase tracking-widest ${label}`}>Reel URL</label>
                {editing ? (
                  <div className={`py-3 text-sm font-medium truncate ${dark ? "text-white/70" : "text-[#0F0F0F]/70"}`}>{dbData?.reelUrl || "Loading..."}</div>
                ) : (
                  <input
                    className={`w-full bg-transparent border-b py-3 text-sm font-medium focus:outline-none transition-all ${textPrimary} ${inputBorder} ${placeholder}`}
                    value={reelUrl} onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.instagram.com/reel/ABC123..."
                  />
                )}
                {!editing && verifying && <p className={`text-[11px] flex items-center gap-1.5 ${textMuted}`}><span className={`w-3 h-3 border border-t-transparent rounded-full animate-spin inline-block ${dark ? "border-white/40" : "border-[#6B6660]"}`} />Verifying...</p>}
                {!editing && verifyError && <p className="text-[11px] text-red-500">{verifyError}</p>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`border rounded-xl p-6 space-y-3 opacity-90 ${card}`}>
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${label}`}>Media ID</label>
                  <div className={`text-sm font-medium italic truncate ${textFaint}`}>{editing ? (dbData?.mediaId || "Loading...") : (mediaId || "Auto-extracted from URL")}</div>
                  <div className={`h-px ${divider}`} />
                  <p className={`text-[10px] font-medium leading-tight italic ${textFaint}`}>This is what Instagram uses to identify your reel</p>
                </div>
                <div className={`border rounded-xl p-6 space-y-3 opacity-90 ${card}`}>
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${label}`}>Caption</label>
                  <div className={`text-sm font-medium line-clamp-3 ${dark ? "text-white/70" : "text-[#0F0F0F]/70"}`}>{editing ? (dbData?.caption || "Auto-extracted from reel") : (caption || "Auto-extracted from reel")}</div>
                  <div className={`h-px ${divider}`} />
                  <p className={`text-[10px] font-medium leading-tight italic ${textFaint}`}>The text description of your reel</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Keywords */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className={`text-xl font-normal mb-1 [font-family:'Instrument_Serif',serif] ${textPrimary}`}>Trigger keywords</h2>
              <p className={`text-xs font-medium uppercase tracking-widest ${textMuted}`}>Anyone who comments these words will receive your automated reply</p>
            </div>
            <div className={`border rounded-xl p-8 ${card}`}>
              <label className={`text-[10px] font-bold uppercase tracking-widest mb-4 block ${label}`}>Keywords</label>
              <div className="flex flex-wrap gap-2 items-center">
                {keywords.map((kw) => (
                  <span key={kw} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium border ${dark ? "bg-white/10 border-white/20 text-white" : "bg-[#0F0F0F]/[0.06] border-[#0F0F0F]/10 text-[#0F0F0F]"}`}>
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="hover:opacity-50 transition-opacity cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  className={`bg-transparent border-none outline-none text-sm font-medium min-w-[150px] px-2 py-1 ${textPrimary} ${placeholder}`}
                  placeholder={keywords.length === 0 ? "Type and press Enter..." : "Add keyword..."}
                  value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={addKeyword}
                />
              </div>
              <div className={`h-px mt-4 mb-3 ${divider}`} />
              <p className={`text-[10px] font-medium ${textFaint}`}>Press Enter to add each keyword. Case insensitive.</p>
            </div>
          </section>

          {/* Section 3: Reply Messages */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className={`text-xl font-normal mb-1 [font-family:'Instrument_Serif',serif] ${textPrimary}`}>Reply messages</h2>
              <p className={`text-xs font-medium uppercase tracking-widest ${textMuted}`}>What to send when someone comments a trigger keyword</p>
            </div>

            <div className="flex flex-col gap-6">

              {/* Comment Reply */}
              <div className={`border rounded-2xl px-6 py-5 ${card}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-[#0F0F0F]/[0.06] border-[#0F0F0F]/10"}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={dark ? "#ffffff80" : "#6B6660"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <label className={`text-sm font-bold [font-family:'Instrument_Serif',serif] ${textPrimary}`}>Comment reply</label>
                    </div>
                  </div>
                </div>
                <textarea
                  className={`w-full bg-transparent border-0 border-b pb-1 text-sm font-medium focus:outline-none transition-all resize-none ${textPrimary} ${dark ? "border-white/10 focus:border-white/30" : "border-[#0F0F0F]/[0.12] focus:border-[#0F0F0F]/30"} ${placeholder}`}
                  rows={1} value={replyToComment} onChange={(e) => setreplyToComment(e.target.value.slice(0, 200))}
                  placeholder="e.g. Hey! I just sent you the link in DMs — check your inbox!"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-[10px] ${textFaint}`}>This reply appears publicly under the comment.</p>
                  <span className={`text-[10px] font-mono ${textFaint}`}>{replyToComment.length} / 200</span>
                </div>
              </div>

              {/* DM Reply */}
              <div className={`border rounded-2xl px-6 py-5 ${card}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-[#0F0F0F]/[0.06] border-[#0F0F0F]/10"}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={dark ? "#ffffff80" : "#6B6660"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </div>
                      <label className={`text-sm font-bold [font-family:'Instrument_Serif',serif] ${textPrimary}`}>DM message</label>
                    </div>
                  </div>
                </div>
                <textarea
                  className={`w-full bg-transparent border-0 border-b pb-1 text-sm font-medium focus:outline-none transition-all resize-none ${textPrimary} ${dark ? "border-white/10 focus:border-white/30" : "border-[#0F0F0F]/[0.12] focus:border-[#0F0F0F]/30"} ${placeholder}`}
                  rows={1} value={replyToDm} onChange={(e) => setreplyToDm(e.target.value)}
                  placeholder="e.g. Here's the resource you asked for: https://yourlink.com"
                />
                <p className={`text-[10px] mt-2 ${textFaint}`}>Requires Meta DM permission approval before sending.</p>
              </div>

            </div>
          </section>

          {/* Footer */}
          <div className={`pt-8 flex items-center justify-end border-t max-w-6xl mx-auto ${dark ? "border-white/[0.07]" : "border-[#0F0F0F]/[0.07]"}`}>
            <button onClick={handleSave} disabled={loading || saved}
              className={`font-medium text-sm px-10 py-4 rounded-full hover:-translate-y-0.5 transition-all active:translate-y-0 flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0 ${dark ? "bg-white text-[#0F0F0F] hover:bg-white/90" : "bg-[#0F0F0F] text-white hover:opacity-85"}`}>
              {loading ? (
                <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${dark ? "border-[#0F0F0F]/20 border-t-[#0F0F0F]" : "border-white/20 border-t-white"}`} />
              ) : saved ? (
                <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Saved!</>
              ) : (
                <>{editing ? "Update Automation" : "Save Automation"}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></>
              )}
            </button>
          </div>

        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </section>
  );
}
