"use client";
import { useState } from "react";
import { useDark } from "@/app/lib/useDark";

const FAQS = [
  {
    q: "What is TriggerInsta and how does it work?",
    a: "TriggerInsta is an Instagram comment automation tool. You connect your Instagram account, set a keyword and a reply message, and whenever someone comments that keyword on your reel or post, TriggerInsta automatically replies to the comment and sends them a DM — all without you lifting a finger.",
  },
  {
    q: "Do I need a Business or Creator Instagram account?",
    a: "Yes. TriggerInsta uses the Instagram Graph API which requires either a Professional (Business or Creator) Instagram account connected to a Facebook Page. Personal accounts are not supported by Meta's API.",
  },
  {
    q: "Will the same person get multiple DMs if they comment more than once?",
    a: "No. TriggerInsta has built-in deduplication — once a user has been replied to on a specific post, they won't receive another automated reply or DM for the same post, no matter how many times they comment.",
  },
  {
    q: "Can I run automations on multiple posts or reels at the same time?",
    a: "Yes, each automation rule is linked to one post or reel. You can create multiple rules — one per post — up to the limit of your plan (1 on Free, 5 on Essential, unlimited on Pro & Advanced).",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "The Free plan lets you try TriggerInsta with 9 triggers at no cost and no credit card required. Paid plans do not currently include a separate trial period, but you can cancel anytime and won't be charged after cancellation.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { dark, mounted } = useDark();
  const t = (light: string, d: string) => dark ? d : light;

  return (
    <section id="faq" className={`relative overflow-hidden px-4 py-28 sm:px-8 sm:py-32 ${t("bg-[#F4F1EB]","bg-[#0a0e1a]")}`}>
      {mounted && dark && <div className="absolute inset-0 bg-[#0a0e1a]/60 pointer-events-none z-0" />}
      <div className="relative z-10 max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <p className={`font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1] tracking-tight mb-2 ${t("text-[#0F0F0F]", "text-white")}`}>
            Frequently asked questions
          </p>
          <p className={`text-lg leading-relaxed max-w-lg mx-auto ${t("text-[#6B6660]", "text-white/50")}`}>
            Everything you need to know before getting started.
          </p>
        </div>

        <div className={`flex flex-col divide-y ${t("divide-[#0F0F0F]/[0.07]", "divide-white/[0.07] ")}`}>
          {FAQS.map((faq, i) => (
            <div key={i} className="py-4">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
              >
                <span className={`text-lg font-medium transition-colors duration-200 ${
                  open === i
                    ? t("text-[#0F0F0F]", "text-white")
                    : t("text-[#0F0F0F] group-hover:text-[#0F0F0F]", "text-white/50 group-hover:text-white")
                }`}>
                  {faq.q}
                </span>
                <span className={`shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-200 ${open === i ? "rotate-180" : ""} hover:scale-105`}>
                  <svg
                    width="16" height="16" viewBox="0 0 12 12" fill="none"
                    stroke={dark ? "rgba(255,255,255,0.8)" : "rgba(15,15,15,0.8)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M2 4.5 L6 8.5 L10 4.5" />
                  </svg>
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? "max-h-60 mt-3" : "max-h-0"}`}>
                <p className={`text-md leading-relaxed ${t("text-[#6B6660]", "text-white/45")}`}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'); .faq-serif{font-family:'Instrument Serif',serif;}`}</style>
    </section>
  );
}
