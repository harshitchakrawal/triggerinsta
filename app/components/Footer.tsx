"use client";
import Link from "next/link";
import { useDark } from "@/app/lib/useDark";

const LINKS = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Resources: ["Documentation", "Blog", "Tutorials", "Support"],
  Company: ["About", "Careers", "Privacy", "Terms"],
};

export default function Footer() {
  const { dark, mounted } = useDark();
  const t = (light: string, d: string) => dark ? d : light;

  return (
    <footer className="relative border-t bg-[#F4F1EB] border-[#0F0F0F]/[0.07]">
      {mounted && dark && <div className="absolute inset-0 bg-[#0a0e1a]/60 pointer-events-none z-0" />}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-16">

          <div className="col-span-2 sm:col-span-1">
            <span className={`font-serif text-xl block mb-3 ${t("text-[#0F0F0F]", "text-white")}`}>triggerflow</span>
            <p className={`text-xs leading-relaxed max-w-[180px] ${t("text-[#6B6660]", "text-white/40")}`}>
              Turn Instagram comments into automated DMs — instantly.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                <svg key="ig" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? "rgba(255,255,255,0.5)" : "#6B6660"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill={dark ? "rgba(255,255,255,0.5)" : "#6B6660"} /></svg>,
                <svg key="x" width="13" height="13" viewBox="0 0 24 24" fill={dark ? "rgba(255,255,255,0.5)" : "#6B6660"}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                <svg key="yt" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? "rgba(255,255,255,0.5)" : "#6B6660"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill={dark ? "rgba(255,255,255,0.5)" : "#6B6660"} stroke="none" /></svg>,
              ].map((icon, i) => (
                <a key={i} href="#" className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${t("bg-[#0F0F0F]/[0.06] border-[#0F0F0F]/10 hover:bg-[#0F0F0F]/10", "bg-white/5 border-white/10 hover:bg-white/10")}`}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-4 ${t("text-[#0F0F0F]", "text-white")}`}>{title}</p>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className={`text-sm transition-colors ${t("text-[#6B6660] hover:text-[#0F0F0F]", "text-white/40 hover:text-white")}`}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`h-px mb-8 ${t("bg-[#0F0F0F]/[0.07]", "bg-white/10")}`} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-xs ${t("text-[#6B6660]", "text-white/40")}`}>© 2025 TriggerFlow, Inc. All rights reserved.</p>
          <div className={`flex items-center gap-1 text-xs ${t("text-[#6B6660]", "text-white/40")}`}>
            <span>Made with</span>
            <span className={`mx-0.5 ${t("text-[#0F0F0F]", "text-white")}`}>♥</span>
            <span>for creators worldwide</span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <a href="#" className={`transition-colors ${t("text-[#6B6660] hover:text-[#0F0F0F]", "text-white/40 hover:text-white")}`}>Privacy Policy</a>
            <a href="#" className={`transition-colors ${t("text-[#6B6660] hover:text-[#0F0F0F]", "text-white/40 hover:text-white")}`}>Terms of Service</a>
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'); footer span.font-serif{font-family:'Instrument Serif',serif;}`}</style>
    </footer>
  );
}
