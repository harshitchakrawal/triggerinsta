"use client";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    monthly: "$0", annual: "$0",
    period: "forever",
    desc: "Try it out, no card needed.",
    features: [
      { text: "9 free triggers", note: "then upgrade" },
      { text: "1 active automation", note: null },
      { text: "Comment replies", note: null },
      { text: "Basic dashboard", note: null },
    ],
    cta: "Get started free",
    href: "/dashboard",
  },
  {
    name: "Essential",
    monthly: "$9", annual: "$6",
    period: "per month",
    desc: "For growing creators.",
    features: [
      { text: "500 triggers/month", note: null },
      { text: "5 active automations", note: null },
      { text: "Comment replies", note: null },
      { text: "Basic analytics", note: null },
      { text: "Email support", note: null },
    ],
    cta: "Get Essential",
    href: "/dashboard",
  },
  {
    name: "Pro",
    monthly: "$19", annual: "$13",
    period: "per month",
    desc: "For creators serious about growth.",
    features: [
      { text: "Unlimited triggers", note: null },
      { text: "Unlimited automations", note: null },
      { text: "Comment + DM replies", note: null },
      { text: "Advanced analytics", note: null },
      { text: "Priority support", note: null },
    ],
    cta: "Get Pro",
    href: "/dashboard",
  },
  {
    name: "Advanced",
    monthly: "$49", annual: "$33",
    period: "per month",
    desc: "For agencies and power users.",
    features: [
      { text: "Everything in Pro", note: null },
      { text: "Up to 10 accounts", note: null },
      { text: "Team access", note: null },
      { text: "Custom integrations", note: null },
      { text: "Dedicated support", note: null },
    ],
    cta: "Get Advanced",
    href: "/dashboard",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <section id="pricing" className="relative py-32 px-4 sm:px-8 bg-[#0F0F0F]">
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-4 text-white">
            Choose your plan.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-1 p-1 rounded-full border bg-white/[0.06] border-white/[0.1]">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billing === "monthly" ? "bg-white text-[#0a0e1a]" : "text-white/50 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billing === "annual" ? "bg-white text-[#0a0e1a]" : "text-white/50 hover:text-white"
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => {
            const price = billing === "annual" ? plan.annual : plan.monthly;
            const showAnnualNote = billing === "annual" && plan.name !== "Free";

            return (
              <div key={plan.name} className="relative rounded-2xl p-8 flex flex-col gap-6 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 text-white/40">{plan.name}</p>
                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="font-serif text-4xl font-normal text-white transition-all duration-300">{price}</span>
                    <div className="mb-1.5">
                      <span className="text-xs block text-white/40">/{plan.period}</span>
                      {showAnnualNote && <span className="text-[9px] text-white/25">billed annually</span>}
                    </div>
                  </div>
                  <p className="text-xs text-white/40">{plan.desc}</p>
                </div>

                <div className="h-px bg-white/[0.08]" />

                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm text-white/70">
                        {f.text}
                        {f.note && <span className="ml-1.5 text-[10px] text-white/30">({f.note})</span>}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="text-center text-sm font-medium py-3 rounded-full transition-all hover:-translate-y-0.5 bg-white text-[#0a0e1a] hover:opacity-90">
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'); #pricing p.font-serif{font-family:'Instrument Serif',serif;}`}</style>
    </section>
  );
}
