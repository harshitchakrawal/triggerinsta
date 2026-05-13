"use client";

import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  LinkIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useDark } from "@/app/lib/useDark";

const STEPS = [
  {
    num: "01",
    label: "Connect",
    title: "Choose the post that should convert",
    desc: "Paste a reel, post, or story URL and TriggerFlow prepares the automation around that exact Instagram asset.",
    detail: "Reels, posts, and stories",
    Icon: LinkIcon,
  },
  {
    num: "02",
    label: "Trigger",
    title: "Add the keyword and response",
    desc: "Set words like LINK, PRICE, or GUIDE, then write the public reply and private DM your audience receives.",
    detail: "Multiple keywords per flow",
    Icon: ChatBubbleLeftRightIcon,
  },
  {
    num: "03",
    label: "Listen",
    title: "Detect comments in real time",
    desc: "TriggerFlow watches for matching comments, prevents duplicate sends, and keeps the experience clean.",
    detail: "Built-in deduplication",
    Icon: BoltIcon,
  },
  {
    num: "04",
    label: "Measure",
    title: "Track every reply and DM",
    desc: "See trigger volume, delivered messages, active automations, and which content is turning comments into action.",
    detail: "Creator-ready analytics",
    Icon: ChartBarIcon,
  },
];

const SIGNALS = [
  { label: "Avg. response", value: "0.4s", Icon: ClockIcon },
  { label: "Duplicate control", value: "On", Icon: ShieldCheckIcon },
  { label: "Flow status", value: "Live", Icon: CheckCircleIcon },
];

export default function Workflow() {
  const { dark, mounted } = useDark();
  const t = (light: string, d: string) => (dark ? d : light);

  return (
    <section
      id="how-it-works"
      className={`relative overflow-hidden px-4 py-28 sm:px-8 sm:py-32 ${t(
        "bg-[#F4F1EB]",
        "bg-[#0a0e1a]"
      )}`}
    >
      {mounted && dark && <div className="absolute inset-0 bg-[#0a0e1a]/60 pointer-events-none z-0" />}

      <div className="relative z-10 mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p
            className={`mb-4 text-[10px] font-bold uppercase tracking-[0.18em] ${t(
              "text-[#6B6660]",
              "text-white/45"
            )}`}
          >
            How it works
          </p>
          <h2
            className={`font-serif text-[clamp(2.25rem,5vw,4.2rem)] font-bold leading-[1.02] tracking-tight ${t(
              "text-[#0F0F0F]",
              "text-white"
            )}`}
          >
            Build a comment-to-DM flow in minutes.
          </h2>
          <p
            className={`mt-5 max-w-xl text-base leading-7 sm:text-lg ${t(
              "text-[#6B6660]",
              "text-white/55"
            )}`}
          >
            Connect a post, define the trigger, and let TriggerFlow turn high-intent comments into instant replies,
            DMs, and measurable follow-up.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {SIGNALS.map(({ label, value, Icon }) => (
              <div
                key={label}
                className={`rounded-lg border p-3 ${t(
                  "border-[#0F0F0F]/[0.08] bg-white/45",
                  "border-white/[0.08] bg-white/[0.04]"
                )}`}
              >
                <Icon className={`mb-3 h-4 w-4 ${t("text-[#0F0F0F]/45", "text-white/45")}`} />
                <p className={`text-lg font-semibold leading-none ${t("text-[#0F0F0F]", "text-white")}`}>{value}</p>
                <p className={`mt-1 text-[10px] leading-4 ${t("text-[#6B6660]", "text-white/40")}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div
            className={`rounded-lg border p-4 shadow-[0_24px_80px_rgba(15,15,15,0.08)] sm:p-5 ${t(
              "border-[#0F0F0F]/[0.08] bg-[#FBFAF7]",
              "border-white/[0.1] bg-white/[0.05]"
            )}`}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold ${t("text-[#0F0F0F]", "text-white")}`}>Launch giveaway flow</p>
                <p className={`mt-1 text-xs ${t("text-[#6B6660]", "text-white/40")}`}>Reel: Summer launch teaser</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${t(
                  "border-emerald-600/15 bg-emerald-600/10 text-emerald-700",
                  "border-emerald-300/15 bg-emerald-300/10 text-emerald-200"
                )}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
              <div
                className={`rounded-lg border p-4 ${t(
                  "border-[#0F0F0F]/[0.08] bg-[#F4F1EB]",
                  "border-white/[0.08] bg-black/10"
                )}`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${t("text-[#6B6660]", "text-white/35")}`}>
                  Incoming comment
                </p>
                <div className="mt-4 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#FF7A59] via-[#E83E8C] to-[#7C3AED]" />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${t("text-[#0F0F0F]", "text-white")}`}>@maya.creates</p>
                    <p className={`mt-1 text-sm leading-6 ${t("text-[#6B6660]", "text-white/55")}`}>
                      This looks useful. Send me the <span className={t("text-[#0F0F0F]", "text-white")}>LINK</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={`hidden items-center px-1 sm:flex ${t("text-[#0F0F0F]/25", "text-white/25")}`}>
                <ArrowRightIcon className="h-5 w-5" />
              </div>

              <div
                className={`rounded-lg border p-4 ${t(
                  "border-[#0F0F0F]/[0.08] bg-[#F4F1EB]",
                  "border-white/[0.08] bg-black/10"
                )}`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${t("text-[#6B6660]", "text-white/35")}`}>
                  Automated output
                </p>
                <div className="mt-4 space-y-3">
                  <div className={`rounded-md p-3 ${t("bg-white/70", "bg-white/[0.06]")}`}>
                    <p className={`text-xs font-semibold ${t("text-[#0F0F0F]", "text-white")}`}>Public reply</p>
                    <p className={`mt-1 text-sm ${t("text-[#6B6660]", "text-white/55")}`}>Sent. Check your inbox.</p>
                  </div>
                  <div className={`rounded-md p-3 ${t("bg-white/70", "bg-white/[0.06]")}`}>
                    <p className={`text-xs font-semibold ${t("text-[#0F0F0F]", "text-white")}`}>Private DM</p>
                    <p className={`mt-1 text-sm ${t("text-[#6B6660]", "text-white/55")}`}>
                      Here is the launch link and bonus guide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {STEPS.map(({ num, label, title, desc, detail, Icon }) => (
              <article
                key={num}
                className={`group rounded-lg border p-5 transition-all duration-300 hover:-translate-y-0.5 ${t(
                  "border-[#0F0F0F]/[0.08] bg-white/40 hover:border-[#0F0F0F]/[0.14] hover:bg-white/65",
                  "border-white/[0.08] bg-white/[0.035] hover:border-white/[0.16] hover:bg-white/[0.06]"
                )}`}
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border ${t(
                      "border-[#0F0F0F]/[0.08] bg-[#F4F1EB]",
                      "border-white/[0.08] bg-white/[0.06]"
                    )}`}
                  >
                    <Icon className={`h-5 w-5 ${t("text-[#0F0F0F]/60", "text-white/60")}`} />
                  </div>
                  <span className={`font-serif text-2xl ${t("text-[#0F0F0F]/[0.18]", "text-white/[0.18]")}`}>{num}</span>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${t("text-[#6B6660]", "text-white/35")}`}>
                  {label}
                </p>
                <h3 className={`mt-2 text-lg font-semibold leading-6 ${t("text-[#0F0F0F]", "text-white")}`}>{title}</h3>
                <p className={`mt-3 text-sm leading-6 ${t("text-[#6B6660]", "text-white/50")}`}>{desc}</p>
                <div
                  className={`mt-5 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium ${t(
                    "border-[#0F0F0F]/[0.08] bg-[#0F0F0F]/[0.03] text-[#0F0F0F]/55",
                    "border-white/[0.08] bg-white/[0.04] text-white/45"
                  )}`}
                >
                  <span className={`h-1 w-1 rounded-full ${t("bg-[#0F0F0F]/35", "bg-white/35")}`} />
                  {detail}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'); h2,.font-serif{font-family:'Instrument Serif',serif;}`}</style>
    </section>
  );
}
