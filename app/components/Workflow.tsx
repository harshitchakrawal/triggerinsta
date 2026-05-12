"use client";
import { useDark } from "@/app/lib/useDark";

const STEPS = [
  { num: "01", label: "Post", title: "Share your reel", desc: "Upload your Instagram reel, story, or post as you normally would. No changes to your content workflow.", detail: "Works with Reels, Stories & Posts" },
  { num: "02", label: "Configure", title: "Set your keyword", desc: "In your TriggerFlow dashboard, paste the reel URL and choose a trigger word — like \"LINK\" or \"ROADMAP\".", detail: "Multiple keywords supported" },
  { num: "03", label: "Engage", title: "Fans comment", desc: "Tell your audience to comment the keyword. They comment, TriggerFlow detects it instantly.", detail: "Real-time detection" },
  { num: "04", label: "Automate", title: "Replies fire instantly", desc: "TriggerFlow sends a public comment reply and a private DM — all within seconds, automatically.", detail: "< 0.4s average response" },
];

export default function Workflow() {
  const { dark, mounted } = useDark();
  const t = (light: string, d: string) => dark ? d : light;

  return (
    <section id="how-it-works" className="relative py-32 px-4 sm:px-8 bg-[#F4F1EB]">
      {mounted && dark && <div className="absolute inset-0 bg-[#0a0e1a]/60 pointer-events-none z-0" />}
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-20">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${t("text-[#6B6660]", "text-white/40")}`}>How it works</p>
            <h2 className={`font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-tight ${t("text-[#0F0F0F]", "text-white")}`}>
              From post to DM<br />
              <em className={`italic ${t("text-[#6B6660]", "text-white/50")}`}>in four steps.</em>
            </h2>
          </div>
          <p className={`text-sm max-w-xs leading-relaxed sm:text-right ${t("text-[#6B6660]", "text-white/50")}`}>
            No code. No manual replies. Just set it up once and let TriggerFlow handle the rest.
          </p>
        </div>

        <div className="relative">
          <div className={`hidden sm:block absolute top-8 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-px ${t("bg-[#0F0F0F]/[0.08]", "bg-white/10")}`} />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col gap-5">
                <div className={`relative z-10 w-16 h-16 rounded-full border flex items-center justify-center flex-shrink-0 ${t("bg-[#F4F1EB] border-[#0F0F0F]/[0.1]", "bg-white/5 border-white/10")}`}>
                  <span className={`font-serif text-xl font-normal ${t("text-[#0F0F0F]/30", "text-white/30")}`}>{step.num}</span>
                </div>
                <div>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.15em] block mb-1 ${t("text-[#6B6660]", "text-white/40")}`}>{step.label}</span>
                  <h3 className={`font-serif text-lg font-normal mb-2 ${t("text-[#0F0F0F]", "text-white")}`}>{step.title}</h3>
                  <p className={`text-sm leading-relaxed mb-3 ${t("text-[#6B6660]", "text-white/50")}`}>{step.desc}</p>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border ${t("text-[#0F0F0F]/50 bg-[#0F0F0F]/[0.04] border-[#0F0F0F]/[0.07]", "text-white/40 bg-white/5 border-white/10")}`}>
                    <span className={`w-1 h-1 rounded-full inline-block ${t("bg-[#0F0F0F]/30", "bg-white/30")}`} />
                    {step.detail}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`sm:hidden flex items-center gap-2 ${t("text-[#0F0F0F]/20", "text-white/20")}`}>
                    <div className={`flex-1 h-px ${t("bg-[#0F0F0F]/[0.08]", "bg-white/10")}`} />
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'); h2,h3{font-family:'Instrument Serif',serif;}`}</style>
    </section>
  );
}
