"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function CreateAutomation() {
  const [mediaId, setMediaId] = useState("");
  const [caption, setCaption] = useState("");
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
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const edit = urlParams.get('edit');
    if (edit) {
      setEditing(true);
      setEditId(edit);
      fetch('/api/rules?edit=' + edit)
        .then(r => r.json())
        .then(data => {
          const rule = data.rule;
          setMediaId(rule.mediaId);
          setReelUrl(rule.reelUrl || '');
          setCaption(rule.caption || '');
          setKeywords(rule.keyword.split(',').map((k: string) => k.trim()));
          setreplyToComment(rule.replyToComment);
          setreplyToDm(rule.replyToDM);
        });
    }
  }, []);

  const handleUrlChange = async (url: string) => {
    setReelUrl(url);
    setMediaId("");
    setCaption("");
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
        setCaption(data.caption || "");
        setVerifyError("");
      } else {
        setVerifyError(data.error);
        setMediaId("");
        setCaption("");
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
      const body = {
        ...(editing ? { id: editId } : {}),
        mediaId,
        reelUrl,
        caption,
        keyword: keywords.join(","),
        replyToComment,
        replyToDm
      };
      const res = await fetch("/api/rules", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        if (editing) {
          window.location.href = '/dashboard/automations';
        }
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
    <section className="cross-grid relative min-h-screen overflow-hidden py-10">

      <div className="relative z-10 w-full pt-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#f0f4ff]/30 hover:text-[#00d4aa] transition-all mb-8 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-black text-[#f0f4ff] tracking-tight mb-4">{editing ? 'Edit automation' : 'Create automation'}</h1>
        </div>

        <div className="space-y-16 pb-20">
          {/* Section 1: Reel Details */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className="text-xl font-black text-[#f0f4ff] mb-1">Reel details</h2>
              <p className="text-[#f0f4ff]/30 text-xs font-bold uppercase tracking-widest">
                Paste your Instagram reel link — we extract the media ID automatically
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 backdrop-blur-md space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#f0f4ff]/30">Reel URL</label>
                <input className="w-full bg-transparent border-b border-white/[0.08] py-3 text-sm font-bold text-[#f0f4ff] focus:outline-none focus:border-[#00d4aa]/50 transition-all placeholder:text-[#f0f4ff]/20"
                  value={reelUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.instagram.com/reel/ABC123..."
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 backdrop-blur-md space-y-3 opacity-90">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#f0f4ff]/30">Media ID</label>
                  <div className="text-sm font-black text-[#f0f4ff]/25 italic truncate">
                    {mediaId || "Auto-extracted from URL"}
                  </div>
                  <div className="h-[1px] bg-white/[0.07]" />
                  <p className="text-[10px] text-[#f0f4ff]/25 font-medium leading-tight italic">This is what Instagram uses to identify your reel</p>
                </div>

                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 backdrop-blur-md space-y-3 opacity-90">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#f0f4ff]/30">Caption</label>
                  <div className="text-sm font-bold text-[#f0f4ff]/60 line-clamp-3">
                    {caption || "Auto-extracted from reel"}
                  </div>
                  <div className="h-[1px] bg-white/[0.07]" />
                  <p className="text-[10px] text-[#f0f4ff]/25 font-medium leading-tight italic">The text description of your reel</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Trigger Keywords */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className="text-xl font-black text-[#f0f4ff] mb-1">Trigger keywords</h2>
              <p className="text-[#f0f4ff]/30 text-xs font-bold uppercase tracking-widest">
                Anyone who comments these words will receive your automated reply
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-8 backdrop-blur-md">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#f0f4ff]/30 mb-4 block">Keywords</label>
              <div className="flex flex-wrap gap-2 items-center">
                {keywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center gap-2 bg-[#00d4aa]/10 border border-[#00d4aa]/20 px-3 py-1.5 rounded-xl text-xs font-black text-[#00d4aa]">
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
                  className="bg-transparent border-none outline-none text-sm font-bold text-[#f0f4ff] min-w-[150px] px-2 py-1 placeholder:text-[#f0f4ff]/20"
                  placeholder={keywords.length === 0 ? "Type and press Enter..." : "Add keyword..."}
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={addKeyword}
                />
              </div>
              <div className="h-[1px] bg-white/[0.07] mt-4 mb-3" />
              <p className="text-[10px] text-[#f0f4ff]/25 font-bold ">
                Press Enter to add each keyword. Case insensitive.
              </p>
            </div>
          </section>

          {/* Section 3: Reply Messages */}
          <section className="space-y-6">
            <div className="px-1">
              <h2 className="text-xl font-black text-[#f0f4ff] mb-1">Reply messages</h2>
              <p className="text-[#f0f4ff]/30 text-xs font-bold uppercase tracking-widest">
                What to send when someone comments a trigger keyword
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#f0f4ff]/30">Comment reply</label>
                  <span className="text-[9px] font-black text-[#00d4aa] px-2 py-1 mb-3 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 uppercase tracking-widest">always works</span>
                </div>
                <textarea className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm font-bold text-[#f0f4ff] focus:outline-none focus:border-[#00d4aa]/30 transition-all resize-none placeholder:text-[#f0f4ff]/20"
                  value={replyToComment}
                  onChange={(e) => setreplyToComment(e.target.value.slice(0, 200))}
                  placeholder="Enter your comment reply..."
                />
                <div className="text-[10px] font-black font-mono text-[#f0f4ff]/20 text-right">
                  {replyToComment.length} / 200
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#f0f4ff]/30">DM message</label>
                  <span className="text-[9px] font-black text-[#f0f4ff]/30 px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] uppercase tracking-widest">requires approval</span>
                </div>
                <textarea className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm font-bold text-[#f0f4ff] focus:outline-none focus:border-[#00d4aa]/30 transition-all resize-none placeholder:text-[#f0f4ff]/20"
                  value={replyToDm}
                  onChange={(e) => setreplyToDm(e.target.value)}
                  placeholder="Enter your DM message..."
                />
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <div className="flex flex-col  sm:flex-row items-center justify-end gap-6 border-t border-white/[0.07] max-w-6xl mx-auto">

            <button
              onClick={handleSave}
              disabled={loading || saved}
              className="text-[#0a0e1a] font-black text-sm px-10 py-4 rounded-xl hover:-translate-y-0.5 transition-all active:translate-y-0 flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0 bg-[#00d4aa] shadow-[0_0_25px_rgba(0,212,170,0.35)]"
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
                  {editing ? 'Update Automation' : 'Save Automation'}
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


