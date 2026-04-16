"use client";
import Link from "next/link";

const LINKS = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Resources: ["Documentation", "Blog", "Tutorials", "Support"],
  Company: ["About", "Careers", "Privacy", "Terms"],
};

export default function Footer() {
  return (
    <footer className="bg-[#F4F1EB] border-t border-[#0F0F0F]/[0.07]">

      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-16">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span className="font-serif text-xl text-[#0F0F0F] block mb-3">triggerflow</span>
            <p className="text-xs text-[#6B6660] leading-relaxed max-w-[180px]">
              Turn Instagram comments into automated DMs — instantly.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 rounded-full bg-[#0F0F0F]/[0.06] border border-[#0F0F0F]/10 flex items-center justify-center hover:bg-[#0F0F0F]/10 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="#6B6660" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className="w-8 h-8 rounded-full bg-[#0F0F0F]/[0.06] border border-[#0F0F0F]/10 flex items-center justify-center hover:bg-[#0F0F0F]/10 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#6B6660">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-8 h-8 rounded-full bg-[#0F0F0F]/[0.06] border border-[#0F0F0F]/10 flex items-center justify-center hover:bg-[#0F0F0F]/10 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#6B6660" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] mb-4">{title}</p>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[#6B6660] hover:text-[#0F0F0F] transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#0F0F0F]/[0.07] mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B6660]">© 2025 TriggerFlow, Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-[#6B6660]">
            <span>Made with</span>
            <span className="text-[#0F0F0F] mx-0.5">♥</span>
            <span>for creators worldwide</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-[#6B6660]">
            <a href="#" className="hover:text-[#0F0F0F] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#0F0F0F] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        footer h2 { font-family: 'Instrument Serif', serif; }
        footer span.font-serif { font-family: 'Instrument Serif', serif; }
      `}</style>
    </footer>
  );
}
