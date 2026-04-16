"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "How do I connect my Instagram account?",
    a: "Go to Settings → Instagram account and paste your Instagram Business account ID. You'll need a Facebook Page connected to your Instagram account and a valid Page Access Token.",
  },
  {
    q: "Why isn't my automation triggering?",
    a: "Make sure the automation is set to Active, the reel URL is verified, and the keyword matches exactly what commenters are typing (case insensitive). Also check that your Instagram account is still connected.",
  },
  {
    q: "What's the difference between comment reply and DM?",
    a: "Comment reply is a public reply posted under the comment — this works immediately. DM (direct message) is sent privately to the commenter's inbox and requires Meta's messaging permission approval.",
  },
  {
    q: "Why are my 9 free triggers used up?",
    a: "Each time a keyword is detected and a reply is sent, it counts as one trigger. Upgrade to Pro for unlimited triggers.",
  },
  {
    q: "Can I use multiple keywords per reel?",
    a: "Yes. When creating an automation, type each keyword and press Enter to add it. All keywords are monitored simultaneously for that reel.",
  },
  {
    q: "Will the same user get multiple replies?",
    a: "No. TriggerFlow deduplicates — each user only receives one reply per reel, no matter how many times they comment the keyword.",
  },
  {
    q: "How do I pause an automation?",
    a: "Go to My Automations, find the automation and click Pause. You can resume it at any time. Paused automations won't trigger any replies.",
  },
];

const GUIDES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    title: "Create your first automation",
    desc: "Step-by-step guide to setting up a keyword trigger on your reel.",
    time: "3 min read",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Writing effective reply messages",
    desc: "Best practices for comment replies and DMs that convert.",
    time: "4 min read",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    ),
    title: "Understanding your analytics",
    desc: "How to read triggers, replies sent, and success rate.",
    time: "2 min read",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
    title: "Connecting Instagram Business",
    desc: "How to link your Instagram account and get your access token.",
    time: "5 min read",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#0F0F0F]/[0.07] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-sm font-medium text-[#0F0F0F] group-hover:text-[#6B6660] transition-colors">{q}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <p className="text-sm text-[#6B6660] leading-relaxed pb-5 -mt-1">{a}</p>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="relative min-h-screen bg-[#F4F1EB] px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative z-10 w-full">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-normal text-[#0F0F0F] tracking-tight [font-family:'Instrument_Serif',serif]">Help & Support</h1>
          <p className="text-xs text-[#6B6660] mt-1">Find answers, guides, and ways to get in touch.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — FAQ */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Search */}
            <div className="flex items-center gap-2 bg-white/60 border border-[#0F0F0F]/[0.07] rounded-xl px-4 backdrop-blur-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-[#0F0F0F] py-3 w-full placeholder:text-[#6B6660]/50"
              />
            </div>

            {/* FAQ list */}
            <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl px-6 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660] pt-6 pb-2">
                Frequently asked questions
              </p>
              {filtered.length > 0 ? (
                filtered.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)
              ) : (
                <p className="text-sm text-[#6B6660] py-8 text-center">No results for "{search}"</p>
              )}
            </div>

            {/* Guides */}
            <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660] mb-4">Guides</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GUIDES.map((g) => (
                  <button key={g.title} className="flex items-start gap-3 p-4 rounded-xl bg-[#0F0F0F]/[0.03] border border-[#0F0F0F]/[0.07] hover:bg-white/80 hover:border-[#0F0F0F]/10 transition-all text-left group">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#0F0F0F]/[0.07] flex items-center justify-center text-[#6B6660] flex-shrink-0 group-hover:text-[#0F0F0F] transition-colors">
                      {g.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0F0F0F] leading-snug mb-0.5">{g.title}</p>
                      <p className="text-[11px] text-[#6B6660] leading-snug">{g.desc}</p>
                      <p className="text-[10px] text-[#6B6660]/50 mt-1.5">{g.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Contact */}
          <div className="flex flex-col gap-4">

            {/* Contact card */}
            <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660] mb-4">Contact support</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660]">Subject</label>
                  <input
                    className="bg-transparent border-b border-[#0F0F0F]/[0.1] py-2 text-sm font-medium text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F]/30 transition-all placeholder:text-[#6B6660]/40"
                    placeholder="e.g. Automation not triggering"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660]">Message</label>
                  <textarea
                    rows={4}
                    className="bg-[#0F0F0F]/[0.03] border border-[#0F0F0F]/[0.07] rounded-xl px-3 py-2.5 text-sm font-medium text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F]/20 transition-all resize-none placeholder:text-[#6B6660]/40"
                    placeholder="Describe your issue..."
                  />
                </div>
                <button className="w-full text-white font-medium text-sm py-3 rounded-full bg-[#0F0F0F] hover:opacity-85 hover:-translate-y-0.5 transition-all">
                  Send message
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660] mb-4">Quick links</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Documentation", href: "#" },
                  { label: "Status page", href: "#" },
                  { label: "Privacy policy", href: "#" },
                  { label: "Terms of service", href: "#" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="flex items-center justify-between py-2 text-sm text-[#6B6660] hover:text-[#0F0F0F] transition-colors group border-b border-[#0F0F0F]/[0.05] last:border-0">
                    {l.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-70 transition-opacity">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="bg-[#0F0F0F] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Support status</p>
              </div>
              <p className="text-sm font-normal [font-family:'Instrument_Serif',serif]">All systems operational</p>
              <p className="text-[11px] text-white/40 mt-1">Avg. response time: under 4 hours</p>
            </div>

          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </section>
  );
}
