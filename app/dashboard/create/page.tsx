"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function CreateAutomation() {
  const [mediaId, setMediaId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const [reelUrl, setReelUrl] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["link"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [replyToComment, setreplyToComment] = useState(
    "Hey! I just sent you the link in DMs — check your inbox!"
  );
  const [replyToDm, setreplyToDm] = useState(
    "Here's the resource you asked for: https://yourlink.com"
  );
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUrlChange = async (url: string) => {
    setReelUrl(url);
    setMediaId("");
    setVerifyError("");

    const match = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (!match) return;

    setVerifying(true);
    try {
      const res = await fetch("/api/media/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setMediaId(data.mediaId);
        setVerifyError("");
      } else {
        setVerifyError(data.error);
        setMediaId("");
      }
    } catch {
      setVerifyError("Failed to verify URL");
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = async () => {
    if (!mediaId) {
      alert("Please enter a valid Instagram reel URL");
      return;
    }
    if (keywords.length === 0) {
      alert("Please add at least one keyword");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaId,
          keyword: keywords.join(","),
          replyToComment,
          replyToDm
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save automation. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newKeyword.trim()) {
      e.preventDefault();
      const kw = newKeyword.trim().toLowerCase();
      if (!keywords.includes(kw)) {
        setKeywords([...keywords, kw]);
      }
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  return (
    <section className="relative min-h-screen overflow-hidden py-10">
      {/* 1. Base Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[#f8f9fb]" style={{
        background: "linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%)"
      }} />

      {/* 2. Dotted Grid Overlay */}
      <div className="dot-grid pointer-events-none absolute inset-0" />

      {/* 3. Soft radial center glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(255,255,255,0.8) 0%, transparent 100%)"
      }} />

      <div className="relative z-10 w-full pt-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#707070] hover:text-[#f05a28] transition-all mb-8 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight mb-4">Create automation</h1>
        </div>

        <div className="space-y-16 pb-20">
          {/* Section 1: Reel Details */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Reel details</h2>
              <p className="text-[#707070] text-xs font-bold uppercase tracking-widest">
                Paste your Instagram reel link — we extract the media ID automatically
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
              <div className="bg-white/80 border border-black/[0.2] rounded-xl p-6 backdrop-blur-md shadow-sm space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#707070]">Reel URL</label>
                <input
                  className="w-full bg-transparent border-b border-black/[0.05] pb-2 text-sm font-bold text-[#1a1a1a] focus:outline-none focus:border-[#f05a28] transition-all placeholder:text-[#ccc]"
                  value={reelUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.instagram.com/reel/ABC123..."
                />
              </div>

              <div className="bg-white/80 border border-black rounded-xl p-6 backdrop-blur-md shadow-sm space-y-3 opacity-90 transition-opacity">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#707070]">Media ID</label>
                <div className="text-sm font-black text-[#1a1a1a]/40 italic truncate">
                  {mediaId || "Auto-extracted from URL"}
                </div>
                <div className="h-[1px] bg-black/[0.05]" />
                <p className="text-[10px] text-black font-medium leading-tight italic">This is what Instagram uses to identify your reel</p>
              </div>
            </div>
          </section>

          {/* Section 2: Trigger Keywords */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Trigger keywords</h2>
              <p className="text-[#707070] text-xs font-bold uppercase tracking-widest">
                Anyone who comments these words will receive your automated reply
              </p>
            </div>

            <div className="bg-white/80 border border-black/[0.15] rounded-xl p-8 backdrop-blur-md shadow-sm">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#707070] mb-4 block">Keywords</label>
              <div className="flex flex-wrap gap-2 items-center">
                {keywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center gap-2 bg-[#f05a28]/10 border border-[#f05a28]/20 px-3 py-1.5 rounded-xl text-xs font-black text-[#f05a28] animate-in zoom-in-95">
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="hover:opacity-60 transition-opacity cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  className="bg-transparent border-none outline-none text-sm font-bold text-[#1a1a1a] min-w-[150px] px-2 py-1"
                  placeholder={keywords.length === 0 ? "Type and press Enter..." : "Add keyword..."}
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={addKeyword}
                />
              </div>
              <div className="h-[1px] bg-black/[0.05] mt-4 mb-3" />
              <p className="text-[10px] text-[#707070] font-bold italic opacity-60">
                Press Enter to add each keyword. Case insensitive.
              </p>
            </div>
          </section>

          {/* Section 3: Reply Messages */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Reply messages</h2>
              <p className="text-[#707070] text-xs font-bold uppercase tracking-widest">
                What to send when someone comments a trigger keyword
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/80 border border-black/[0.2] rounded-xl p-6 backdrop-blur-md shadow-sm ">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#707070]">Comment reply</label>
                  <span className="text-[9px] font-black text-[#f05a28] px-2 py-1 rounded-full bg-[#f05a28]/10 border border-[#f05a28]/20 uppercase tracking-widest">
                    always works
                  </span>
                </div>
                <textarea
                  className="w-full bg-black/[0.02] border border-black/[0.05] rounded-xl px-4 py-3 text-sm font-bold text-[#1a1a1a] focus:outline-none focus:border-[#f05a28]/40 transition-all resize-none "
                  value={replyToComment}
                  onChange={(e) => setreplyToComment(e.target.value.slice(0, 200))}
                  placeholder="Enter your comment reply..."
                />
                <div className="text-[10px] font-black font-mono text-[#ccc] text-right">
                  {replyToComment.length} / 200
                </div>
              </div>

              <div className="bg-white/80 border border-black rounded-xl p-6 backdrop-blur-md shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#707070]">DM message</label>
                  <span className="text-[9px] font-black text-[#707070] px-2 py-1 rounded-full bg-black/[0.05] border border-black/[0.05] uppercase tracking-widest font-mono">
                    requires approval
                  </span>
                </div>
                <textarea
                  className="w-full bg-black/[0.02] border border-black/[0.05] rounded-xl px-4 py-3 text-sm font-bold text-[#1a1a1a] focus:outline-none focus:border-[#f05a28]/40 transition-all resize-none"
                  value={replyToDm}
                  onChange={(e) => setreplyToDm(e.target.value)}
                  placeholder="Enter your DM message..."
                />
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-black/[0.15] max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-[#707070]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f05a28] animate-pulse" />
              <p className="text-[11px] font-bold tracking-tight">Active immediately after saving.</p>
            </div>

            <button
              onClick={handleSave}
              disabled={loading || saved}
              className="text-white font-black text-sm px-10 py-4 rounded-xl hover:-translate-y-0.5 transition-all active:translate-y-0 shadow-md flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0"
              style={{ background: "#f05a28", boxShadow: "0 4px 20px rgba(240,90,40,0.4)" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-[2px] border-white/20 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  Save Automation
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


