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


export default function Workflow() {
  const { dark, mounted } = useDark();
  const t = (light: string, d: string) => (dark ? d : light);
  const launchFlowCard = (
    <div
      className={`rounded-lg border p-3 shadow-[0_24px_80px_rgba(15,15,15,0.08)] sm:p-4 ${t(
        "border-[#0F0F0F]/[0.08] bg-[#FBFAF7]",
        "border-white/[0.1] bg-white/[0.05]"
      )}`}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className={`text-md font-semibold ${t("text-[#0F0F0F]", "text-white")}`}>Here is an Example.</p>
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

      <div className="grid gap-2 xl:grid-cols-[1fr_auto_1fr] xl:items-stretch">
        <div
          className={`rounded-lg  border p-3 ${t(
            "border-[#0F0F0F]/[0.08] bg-[#F4F1EB]",
            "border-white/[0.08] bg-black/10"
          )}`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${t("text-[#6B6660]", "text-white/35")}`}>
            Incoming comment
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <img src="https://i.pravatar.cc/36?img=47" alt="maya.creates" className="h-9 w-9 rounded-full object-cover" />
              <div className="min-w-0">
                <p className={`text-sm font-medium ${t("text-[#0F0F0F]", "text-white")}`}>@maya.creates</p>
                <p className={`mt-1 text-sm leading-6 ${t("text-[#6B6660]", "text-white/55")}`}>
                  This looks useful. Send me the <span className={t("text-[#0F0F0F]", "text-white")}>LINK</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <img src="https://i.pravatar.cc/36?img=12" alt="alex.markets" className="h-9 w-9 rounded-full object-cover" />
              <div className="min-w-0">
                <p className={`text-sm font-medium ${t("text-[#0F0F0F]", "text-white")}`}>@alex.markets</p>
                <p className={`mt-1 text-sm leading-6 ${t("text-[#6B6660]", "text-white/55")}`}>
                  Nice! Send  me the <span className={t("text-[#0F0F0F]", "text-white")}>LINK</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`hidden items-center px-1 xl:flex ${t("text-[#0F0F0F]/25", "text-white/25")}`}>
          <ArrowRightIcon className="h-5 w-5" />
        </div>

        <div
          className={`rounded-lg border p-3 ${t(
            "border-[#0F0F0F]/[0.08] bg-[#F4F1EB]",
            "border-white/[0.08] bg-black/10"
          )}`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${t("text-[#6B6660]", "text-white/35")}`}>
            Automated output
          </p>
          <div className="mt-2 space-y-3">
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
  );

  return (
    <section
      id="how-it-works"
      className={`relative overflow-hidden px-4 py-28 sm:px-8 sm:py-32 ${t(
        "bg-[#F4F1EB]",
        "bg-[#0a0e1a]"
      )}`}
    >
      {mounted && dark && <div className="absolute inset-0 bg-[#0a0e1a]/60 pointer-events-none z-0" />}

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <h2
            className={`font-serif text-[clamp(2.25rem,5vw,4.2rem)] font-bold leading-[1.02] tracking-tight ${t(
              "text-[#0F0F0F]",
              "text-white"
            )}`}
          >
            Build a comment-to-DM flow in minutes.
          </h2>
          <p
            className={`mt-3 max-w-xl text-base leading-7 sm:text-lg ${t(
              "text-[#6B6660]",
              "text-white/55"
            )}`}
          >
            Connect a post, define the trigger, and let TriggerFlow turn high-intent comments into instant replies,
            DMs, and measurable follow-up.
          </p>

          <div className="mt-1 lg:mt-4">{launchFlowCard}</div>
        </div>

        <div className="self-start">
          <div className="grid gap-4 sm:grid-cols-2 mt-5">
            {STEPS.map(({ num, label, title, desc, detail }) => (
              <article
                key={num}
                className={`group flex flex-col rounded-lg border p-6 transition-all duration-300 hover:-translate-y-0.5 ${t(
                  "border-white/[0.08] bg-[#0F0F0F] hover:border-white/[0.16] hover:bg-[#111111]",
                  "border-[#0F0F0F]/[0.08] bg-white/40 hover:border-[#0F0F0F]/[0.14] hover:bg-white/65"
                )}`}
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className={`font-serif text-2xl ${t("text-white/[0.18]", "text-[#0F0F0F]/[0.18]")}`}>{num}</span>
                  <p className={`font-serif text-sm font-extrabold uppercase tracking-[0.12em] ${t("text-white", "text-[#0F0F0F]")}`}>
                    {label}
                  </p>
                </div>
                <h3 className={`mt-2 text-md font-semibold leading-6 ${t("text-white", "text-[#0F0F0F]")}`}>{title}</h3>
                <p className={`mt-1 text-sm leading-6 ${t("text-white/50", "text-[#6B6660]")}`}>{desc}</p>
                {/* <div
                  className={`mt-auto self-start inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-medium ${t(
                    "border-white/[0.08] bg-white/[0.04] text-white/45",
                    "border-[#0F0F0F]/[0.08] bg-[#0F0F0F]/[0.03] text-[#0F0F0F]/55"
                  )}`}
                >
                  <span className={` rounded-full ${t("bg-white/35", "bg-[#0F0F0F]/35")}`} />
                  {detail}
                </div> */}
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'); h2,.font-serif{font-family:'Instrument Serif',serif;}`}</style>
    </section>
  );
}
