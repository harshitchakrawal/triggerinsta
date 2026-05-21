"use client";
import React from "react";
import { useDark } from "@/app/lib/useDark";

const LINKS = {
  Explore: ["Features", "How it works", "Pricing", "Changelog"],
  Support: ["Documentation", "FAQ", "Tutorials", "About"],
};

export default function Footer() {
  const { dark, mounted } = useDark();
  const t = (light: string, d: string) => dark ? d : light;

  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  const inputCls = `w-full px-4 py-2.5 text-sm outline-none rounded-lg border transition-all duration-200 ${t(
    "bg-white/70 border-[#0F0F0F]/10 text-[#0F0F0F] placeholder-[#0F0F0F]/30 focus:border-[#0F0F0F]/30 focus:bg-white",
    "bg-white/5 border-white/8 text-white placeholder-white/30 focus:border-white/20 focus:bg-white/8"
  )}`;

  return (
    <footer className={`relative border-t ${t("bg-[#F4F1EB] border-[#0F0F0F]/[0.07]", "bg-[#0a0e1a] border-white/[0.06]")}`}>
      {mounted && dark && <div className="absolute inset-0 bg-[#050810] pointer-events-none z-0" />}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-10">

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr_1.2fr] gap-14">

          {/* Left — headline + social */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className={`text-4xl font-bold leading-tight mb-4 ${t("text-[#0F0F0F]", "text-white")}`}>
                Get in Contact
              </h2>
              <p className={`text-sm leading-relaxed max-w-xs ${t("text-[#6B6660]", "text-white/40")}`}>
                We craft smooth, seamless automation — your feedback helps us refine everything we build.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8">
              {/* Instagram */}
              <a href="#" className={`transition-opacity hover:opacity-60 ${t("text-[#0F0F0F]", "text-white/60")}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className={`transition-opacity hover:opacity-60 ${t("text-[#0F0F0F]", "text-white/60")}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className={`transition-opacity hover:opacity-60 ${t("text-[#0F0F0F]", "text-white/60")}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* Middle — link columns */}
          <div className="grid grid-cols-2 gap-8 pt-1">
            {Object.entries(LINKS).map(([title, links]) => (
              <div key={title}>
                <p className={`text-sm font-semibold mb-5 ${t("text-[#0F0F0F]", "text-white")}`}>{title}</p>
                <ul className="flex flex-col gap-3">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className={`text-sm transition-colors ${t("text-[#6B6660] hover:text-[#0F0F0F]", "text-white/40 hover:text-white")}`}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right — contact form */}
          <div className="pt-1">
            <p className={`text-sm font-semibold mb-5 ${t("text-[#0F0F0F]", "text-white")}`}>Contact us</p>

            {sent ? (
              <div className={`rounded-xl px-5 py-8 text-center border ${t("border-[#0F0F0F]/10", "border-white/[0.07]")}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-3 ${t("bg-[#0F0F0F] text-white", "bg-white text-[#0F0F0F]")}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className={`text-sm font-semibold mb-1 ${t("text-[#0F0F0F]", "text-white")}`}>Message sent!</p>
                <p className={`text-xs ${t("text-[#6B6660]", "text-white/40")}`}>We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                  required
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputCls} resize-none`}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-sm font-semibold mt-1 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${t(
                    "bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/85",
                    "bg-white text-[#0F0F0F] hover:bg-white/90"
                  )}`}
                >
                  {loading ? (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                  ) : "Send message"}
                </button>
              </form>
            )}

            {/* Contact details below form */}
            <div className={`mt-5 flex flex-col gap-2.5 ${t("text-[#6B6660]", "text-white/40")}`}>
              <a href="mailto:hello@triggerinsta.com" className="flex items-center gap-2.5 text-sm hover:opacity-80 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                hello@triggerinsta.com
              </a>
              <a href="tel:+11234567890" className="flex items-center gap-2.5 text-sm hover:opacity-80 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +1 (234) 567-89
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`h-px mt-14 mb-7 ${t("bg-[#0F0F0F]/[0.07]", "bg-white/[0.06]")}`} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`text-xs ${t("text-[#6B6660]", "text-white/30")}`}>© 2025 TriggerInsta, Inc. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs">
            <a href="#" className={`transition-colors ${t("text-[#6B6660] hover:text-[#0F0F0F]", "text-white/30 hover:text-white")}`}>Privacy Policy</a>
            <a href="#" className={`transition-colors ${t("text-[#6B6660] hover:text-[#0F0F0F]", "text-white/30 hover:text-white")}`}>Terms of Service</a>
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </footer>
  );
}
