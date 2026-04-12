"use client";
import Link from "next/link";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant triggers",
    desc: "The moment someone comments your keyword, TriggerFlow fires — no delay, no manual work.",
  },
  {
    icon: "✉️",
    title: "Automated DMs",
    desc: "Send personalized direct messages with links, resources, or roadmaps automatically.",
  },
  {
    icon: "💬",
    title: "Comment replies",
    desc: "Publicly reply to comments to boost engagement and signal activity on your posts.",
  },
  {
    icon: "🔑",
    title: "Custom keywords",
    desc: "Set any word or phrase as a trigger. Multiple keywords per reel, fully customizable.",
  },
  {
    icon: "📊",
    title: "Live analytics",
    desc: "Track triggers, replies sent, and success rates in real time from your dashboard.",
  },
  {
    icon: "🔒",
    title: "Deduplication",
    desc: "Each user only gets one reply per reel — no spam, no repeated messages.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Post your reel",
    desc: "Share your Instagram reel, story, or post as you normally would.",
  },
  {
    num: "02",
    title: "Set a keyword",
    desc: "Choose a trigger word like "LINK" or "ROADMAP" in your TriggerFlow dashboard.",
  },
  {
    num: "03",
    title: "Fans comment",
    desc: "Your audience comments the keyword on your post — that's all they need to do.",
  },
  {
    num: "04",
    title: "TriggerFlow fires",
    desc: "Instantly sends a comment reply and a personalized DM with your resource.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for getting started.",
    features: ["3 active automations", "100 triggers/month", "Comment replies", "Basic analytics"],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    desc: "For creators serious about growth.",
    features: ["Unlimited automations", "Unlimited triggers", "Comment + DM replies", "Advanced analytics", "Priority support"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "per month",
    desc: "Manage multiple accounts.",
    features: ["Everything in Pro", "Up to 10 accounts", "Team access", "Custom integrations", "Dedicated support"],
    cta: "Contact us",
    highlight: false,
  },
];

export default function HeroPage() {
  return (
    <div className="relative bg-[#F4F1EB] text-[#0F0F0F] font-sans overflow-x-hidden">

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1000] opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          animation: "grain 0.5s steps(1) infinite",
        }}
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-[20vh] text-center overflow-hidden px-4">
        <div className="relative z-[2] animate-[fadeUp_0.7s_ease_both]">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#0F0F0F]/[0.06] border border-[#0F0F0F]/10 text-xs font-medium text-[#6B6660]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F0F0F] inline-block" />
            Instagram comment automation
          </div>
          <h1 className="font-serif text-[clamp(3rem,7.5vw,6rem)] leading-[1.05] tracking-[-0.02em] font-normal max-w-[720px] mx-auto">
            Flows That Move<br />
            <em className="italic text-[#6B6660]">At the Speed of Thought.</em>
          </h1>
          <p className="mt-[1.1rem] text-[0.92rem] text-[#6B6660] max-w-[460px] mx-auto leading-[1.7] font-normal">
            Transform engagement into action with instant replies and automated DMs triggered by keywords. Scale your communication without scaling your effort.
          </p>
          <div className="mt-[1.8rem] flex items-center justify-center gap-3 flex-wrap">
            <Link href="/dashboard" className="bg-[#0F0F0F] text-white border-none rounded-full px-[1.6rem] py-3 text-[0.88rem] font-medium cursor-pointer inline-flex items-center gap-2 tracking-[0.01em] hover:opacity-85 hover:-translate-y-px transition-all duration-200">
              Start for free <span className="text-base not-italic">↗</span>
            </Link>
            <a href="#how-it-works" className="text-[0.88rem] font-medium text-[#6B6660] hover:text-[#0F0F0F] transition-colors">
              See how it works →
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-[#0F0F0F]" />
          <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-32 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6660] mb-3">How it works</p>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-tight">
            Four steps to<br /><em className="italic text-[#6B6660]">effortless automation.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#0F0F0F]/[0.08] rounded-2xl overflow-hidden">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-[#F4F1EB] p-10 hover:bg-white/60 transition-colors duration-300">
              <span className="font-serif text-[3rem] font-normal text-[#0F0F0F]/10 leading-none block mb-4">{step.num}</span>
              <h3 className="font-serif text-xl font-normal text-[#0F0F0F] mb-2">{step.title}</h3>
              <p className="text-sm text-[#6B6660] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6660] mb-3">Features</p>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-tight">
            Everything you need<br /><em className="italic text-[#6B6660]">to grow on autopilot.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl p-8 hover:bg-white/90 hover:border-[#0F0F0F]/10 transition-all duration-300 group">
              <span className="text-2xl mb-5 block">{f.icon}</span>
              <h3 className="font-serif text-lg font-normal text-[#0F0F0F] mb-2">{f.title}</h3>
              <p className="text-sm text-[#6B6660] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-32 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6660] mb-3">Pricing</p>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-tight">
            Simple, honest<br /><em className="italic text-[#6B6660]">pricing.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 ${plan.highlight ? "bg-[#0F0F0F] text-white" : "bg-white/60 border border-[#0F0F0F]/[0.07] hover:bg-white/90"}`}>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1 ${plan.highlight ? "text-white/50" : "text-[#6B6660]"}`}>{plan.name}</p>
                <div className="flex items-end gap-1.5">
                  <span className={`font-serif text-4xl font-normal ${plan.highlight ? "text-white" : "text-[#0F0F0F]"}`}>{plan.price}</span>
                  <span className={`text-xs mb-1.5 ${plan.highlight ? "text-white/40" : "text-[#6B6660]"}`}>/{plan.period}</span>
                </div>
                <p className={`text-sm mt-1 ${plan.highlight ? "text-white/50" : "text-[#6B6660]"}`}>{plan.desc}</p>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className={`text-sm flex items-center gap-2.5 ${plan.highlight ? "text-white/80" : "text-[#0F0F0F]"}`}>
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${plan.highlight ? "bg-white/50" : "bg-[#0F0F0F]/40"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/dashboard" className={`text-center text-sm font-medium py-3 rounded-full transition-all hover:-translate-y-0.5 ${plan.highlight ? "bg-white text-[#0F0F0F] hover:opacity-90" : "bg-[#0F0F0F] text-white hover:opacity-85"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-32 px-4 text-center border-t border-[#0F0F0F]/[0.07]">
        <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-tight mb-4">
          Ready to automate<br /><em className="italic text-[#6B6660]">your growth?</em>
        </h2>
        <p className="text-sm text-[#6B6660] max-w-sm mx-auto mb-8 leading-relaxed">
          Join 50,000+ creators already using TriggerFlow to turn comments into conversations.
        </p>
        <Link href="/dashboard" className="bg-[#0F0F0F] text-white rounded-full px-8 py-3.5 text-sm font-medium inline-flex items-center gap-2 hover:opacity-85 hover:-translate-y-px transition-all">
          Get started free <span className="text-base">↗</span>
        </Link>
        <p className="text-[11px] text-[#6B6660]/50 mt-4">No credit card required · Free forever plan available</p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#0F0F0F]/[0.07] px-8 py-8 flex items-center justify-between flex-wrap gap-4">
        <span className="font-serif text-sm text-[#0F0F0F]">triggerflow</span>
        <p className="text-xs text-[#6B6660]">© 2025 TriggerFlow. All rights reserved.</p>
        <div className="flex items-center gap-6 text-xs text-[#6B6660]">
          <a href="#" className="hover:text-[#0F0F0F] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#0F0F0F] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#0F0F0F] transition-colors">Contact</a>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes grain {
          0%,100%{transform:translate(0,0)}
          10%{transform:translate(-2%,-3%)}
          20%{transform:translate(3%,2%)}
          30%{transform:translate(-1%,4%)}
          40%{transform:translate(4%,-1%)}
          50%{transform:translate(-3%,1%)}
          60%{transform:translate(2%,-4%)}
          70%{transform:translate(-4%,3%)}
          80%{transform:translate(1%,-2%)}
          90%{transform:translate(3%,4%)}
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        h1, h2, h3 { font-family: 'Instrument Serif', serif; }
      `}</style>
    </div>
  );
}
