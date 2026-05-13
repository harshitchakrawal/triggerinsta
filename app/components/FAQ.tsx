"use client";
import { useState } from "react";
import { useDark } from "@/app/lib/useDark";

const FAQS = [
  {
    q: "What is TriggerFlow and how does it work?",
    a: "TriggerFlow is an Instagram comment automation tool. You connect your Instagram account, set a keyword and a reply message, and whenever someone comments that keyword on your reel or post, TriggerFlow automatically replies to the comment and sends them a DM — all without you lifting a finger.",
  },
  {
    q: "Do I need a Business or Creator Instagram account?",
    a: "Yes. TriggerFlow uses the Instagram Graph API which requires either a Professional (Business or Creator) Instagram account connected to a Facebook Page. Personal accounts are not supported by Meta's API.",
  },
  {
    q: "What counts as a trigger?",
    a: "A trigger is counted each time TriggerFlow detects a matching keyword comment and fires an automated reply or DM. On the Free plan you get 9 triggers total. Essential gives you 500 per month, and Pro & Advanced offer unlimited triggers.",
  },
  {
    q: "What is the difference between Comment Reply and DM Reply?",
    a: "A Comment Reply is a public response posted under the original comment on your post. A DM Reply is a private message sent directly to the commenter's Instagram inbox. Free and Essential plans include comment replies; DM replies are available on Pro and above.",
  },
  {
    q: "Can I set multiple keywords for one automation?",
    a: "Yes. You can enter comma-separated keywords (e.g. \"link, price, info\") and TriggerFlow will trigger if a comment contains any one of them.",
  },
  {
    q: "Will the same person get multiple DMs if they comment more than once?",
    a: "No. TriggerFlow has built-in deduplication — once a user has been replied to on a specific post, they won't receive another automated reply or DM for the same post, no matter how many times they comment.",
  },
 
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { dark } = useDark();
  const t = (light: string, d: string) => dark ? d : light;

  return (
    <section className={`px-4 sm:px-8 py-32 border-t ${t("bg-[#F4F1EB] border-[#0F0F0F]/[0.07]", "bg-[#0a0e1a] border-white/[0.07]")}`}>
      <div className="max-w-3xl mx-auto">

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
                <span className={`text-md font-medium transition-colors duration-200 ${
                  open === i
                    ? t("text-[#0F0F0F]", "text-white")
                    : t("text-[#0F0F0F] group-hover:text-[#0F0F0F]", "text-white/50 group-hover:text-white")
                }`}>
                  {faq.q}
                </span>
                <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  open === i
                    ? t("border-[#0F0F0F]/30 bg-[#0F0F0F]/8", "border-white/30 bg-white/10")
                    : t("border-[#0F0F0F]/15 group-hover:border-[#0F0F0F]/30", "border-white/15 group-hover:border-white/30")
                }`}>
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={`transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}
                    stroke={dark ? "rgba(255,255,255,0.5)" : "rgba(15,15,15,0.5)"} strokeWidth="1.5" strokeLinecap="round"
                  >
                    <line x1="5" y1="1" x2="5" y2="9" />
                    <line x1="1" y1="5" x2="9" y2="5" />
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
