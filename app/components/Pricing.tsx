"use client";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    badge: null,
    desc: "Try it out, no card needed.",
    highlight: false,
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
    name: "Pro",
    price: "$12",
    period: "per month",
    badge: "Most popular",
    desc: "For creators serious about growth.",
    highlight: true,
    features: [
      { text: "Unlimited triggers", note: null },
      { text: "Unlimited automations", note: null },
      { text: "Comment + DM replies", note: null },
      { text: "Advanced analytics", note: null },
      { text: "Priority support", note: null },
    ],
    cta: "Start free trial",
    href: "/dashboard",
  },
  {
    name: "Agency",
    price: "$39",
    period: "per month",
    badge: null,
    desc: "Manage multiple accounts.",
    highlight: false,
    features: [
      { text: "Everything in Pro", note: null },
      { text: "Up to 10 accounts", note: null },
      { text: "Team access", note: null },
      { text: "Custom integrations", note: null },
      { text: "Dedicated support", note: null },
    ],
    cta: "Contact us",
    href: "/dashboard",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#F4F1EB] py-32 px-4 sm:px-8 border-t border-[#0F0F0F]/[0.07]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6660] mb-3">Pricing</p>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-tight text-[#0F0F0F] mb-4">
            Start free.<br />
            <em className="italic text-[#6B6660]">Scale when ready.</em>
          </h2>
          <p className="text-sm text-[#6B6660] max-w-sm mx-auto leading-relaxed">
            Your first <span className="font-semibold text-[#0F0F0F]">9 triggers are completely free</span> — no credit card, no commitment. Upgrade only when you need more.
          </p>
        </div>

        {/* Free tier callout */}
        <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0F0F0F]/[0.06] border border-[#0F0F0F]/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F0F0F]">9 free triggers to get you started</p>
              <p className="text-xs text-[#6B6660] mt-0.5">No credit card required. See the magic before you commit.</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-xs font-medium text-white bg-[#0F0F0F] px-5 py-2.5 rounded-full hover:opacity-85 transition-all whitespace-nowrap flex-shrink-0">
            Claim free triggers →
          </Link>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 ${
                plan.highlight
                  ? "bg-[#0F0F0F] text-white"
                  : "bg-white/60 border border-[#0F0F0F]/[0.07] hover:bg-white/90"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest bg-white text-[#0F0F0F] border border-[#0F0F0F]/10 px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              {/* Plan header */}
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ${plan.highlight ? "text-white/40" : "text-[#6B6660]"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className={`font-serif text-4xl font-normal ${plan.highlight ? "text-white" : "text-[#0F0F0F]"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-xs mb-1.5 ${plan.highlight ? "text-white/40" : "text-[#6B6660]"}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-xs ${plan.highlight ? "text-white/50" : "text-[#6B6660]"}`}>{plan.desc}</p>
              </div>

              {/* Divider */}
              <div className={`h-px ${plan.highlight ? "bg-white/10" : "bg-[#0F0F0F]/[0.07]"}`} />

              {/* Features */}
              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-2.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "rgba(255,255,255,0.4)" : "rgba(15,15,15,0.3)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className={`text-sm ${plan.highlight ? "text-white/80" : "text-[#0F0F0F]"}`}>
                      {f.text}
                      {f.note && (
                        <span className={`ml-1.5 text-[10px] ${plan.highlight ? "text-white/30" : "text-[#6B6660]"}`}>
                          ({f.note})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`text-center text-sm font-medium py-3 rounded-full transition-all hover:-translate-y-0.5 ${
                  plan.highlight
                    ? "bg-white text-[#0F0F0F] hover:opacity-90"
                    : "bg-[#0F0F0F] text-white hover:opacity-85"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <p className="text-center text-xs text-[#6B6660]/60 mt-8">
          All plans include SSL security, 99.9% uptime SLA, and GDPR compliance. Cancel anytime.
        </p>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        #pricing h2 { font-family: 'Instrument Serif', serif; }
      `}</style>
    </section>
  );
}
