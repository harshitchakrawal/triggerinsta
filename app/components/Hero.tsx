"use client";

import React, { useEffect, useRef, useState } from "react";

const COMMENTS = [
  { name: "sarah_creative", avatar: "SC", text: "LINK 🔥",            color: "#00d4aa" },
  { name: "devmark99",      avatar: "DM", text: "Send me the roadmap!", color: "#7c6af7" },
  { name: "alex.builds",   avatar: "AB", text: "LINK",                color: "#00d4aa" },
  { name: "priya_design",  avatar: "PD", text: "Roadmap pls 👀",      color: "#f59e0b" },
];

const STATS = [
  { value: "10M+", label: "DMs Sent" },
  { value: "50K+", label: "Creators" },
  { value: "0.3s", label: "Response" },
];

export default function Hero() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showDm, setShowDm]             = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startCycle = () => {
    let count = 0;
    const tick = () => {
      count++;
      setVisibleCount(count);
      if (count < COMMENTS.length) {
        timerRef.current = setTimeout(tick, 900);
      } else {
        timerRef.current = setTimeout(() => {
          setShowDm(true);
          timerRef.current = setTimeout(() => {
            setVisibleCount(0);
            setShowDm(false);
            timerRef.current = setTimeout(startCycle, 600);
          }, 3000);
        }, 400);
      }
    };
    timerRef.current = setTimeout(tick, 800);
  };

  useEffect(() => {
    startCycle();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <section className="cross-grid relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#00d4aa]/8 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[15%] w-80 h-80 bg-[#7c6af7]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-[20%] right-[10%] w-64 h-64 bg-[#00d4aa]/6 rounded-full blur-3xl" />

      {/* CENTER COPY */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-xs font-bold text-[#00d4aa] backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
          Automate your Instagram comments
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[5.2rem] font-black leading-[1.05] tracking-tight text-[#f0f4ff]">
          Comment{" "}
          <span className="relative inline-block px-3 py-1 rounded-xl text-[#0a0e1a] bg-[#00d4aa] shadow-[0_0_40px_rgba(0,212,170,0.4)]">
            "LINK"
          </span>
          <br />
          <span className="text-[#f0f4ff]/50">get it in your </span>
          <span className="relative inline-block text-[#f0f4ff]">
            DMs
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none" aria-hidden>
              <path d="M0 6 Q50 1 100 5 Q150 9 200 3" stroke="#00d4aa" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
          .
        </h1>

        {/* Sub */}
        <p className="mt-6 text-base sm:text-lg text-[#f0f4ff]/50 leading-relaxed max-w-lg">
          Post a reel. Fans comment a keyword. TriggerFlow instantly fires a
          personalized DM with your link, roadmap, or resource.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-black text-[#0a0e1a] bg-[#00d4aa] shadow-[0_0_30px_rgba(0,212,170,0.35)] hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(0,212,170,0.5)] transition-all active:translate-y-0"
          >
            Try free for 14 days
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-[#f0f4ff]/70 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:text-[#f0f4ff] transition-all"
          >
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["#00d4aa","#7c6af7","#f59e0b","#f05a28","#22c55e"].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0a0e1a] flex items-center justify-center text-[8px] font-black text-white" style={{ background: c }}>
                {["SC","DM","AB","PD","MK"][i]}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#f0f4ff]/40">
            <span className="font-black text-[#f0f4ff]">50,000+</span> creators already automating
          </p>
        </div>

        {/* Platform tags */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {["Instagram","YouTube","Twitter / X","LinkedIn"].map((p) => (
            <span key={p} className="px-3 py-1 rounded-full text-[11px] font-medium text-[#f0f4ff]/40 bg-white/[0.04] border border-white/[0.07]">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* LEFT CARD — live comment feed */}
      <div className="absolute left-[3%] xl:left-[6%] top-1/2 -translate-y-1/2 w-[210px] hidden lg:block">
        <div className="glass rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#f0f4ff]/30">Live Comments</p>
          </div>
          <div className="flex flex-col gap-2.5 min-h-[110px]">
            {COMMENTS.slice(0, visibleCount).map((c, i) => (
              <div key={i} className="flex items-center gap-2" style={{ animation: "slideUp 0.35s ease-out both" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white flex-shrink-0" style={{ background: c.color }}>
                  {c.avatar}
                </div>
                <div>
                  <p className="text-[9px] text-[#f0f4ff]/30 leading-none mb-0.5">@{c.name}</p>
                  <p className="text-xs font-bold text-[#f0f4ff]">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          {showDm && (
            <div className="mt-3 pt-3 border-t border-white/[0.07]" style={{ animation: "slideUp 0.4s ease-out both" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#00d4aa]">TriggerFlow fired ⚡</span>
              </div>
              <p className="text-[10px] text-[#f0f4ff]/40 italic">"Hey! Here's your link 🔗"</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CARD — stats */}
      <div className="absolute right-[3%] xl:right-[6%] top-1/2 -translate-y-1/2 w-[175px] hidden lg:block">
        <div className="glass rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-xl font-black text-[#00d4aa] leading-none">{s.value}</p>
              <p className="text-[10px] text-[#f0f4ff]/40 mt-0.5 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating pills */}
      <div className="absolute left-[6%] top-[22%] hidden lg:flex items-center gap-2 bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-bold px-4 py-2 rounded-full backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
        DM sent in 0.3s
      </div>
      <div className="absolute right-[6%] bottom-[22%] hidden lg:flex items-center gap-2 bg-[#7c6af7]/10 border border-[#7c6af7]/20 text-[#7c6af7] text-xs font-black px-4 py-2 rounded-full backdrop-blur-sm rotate-2">
        ⚡ keyword matched
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
