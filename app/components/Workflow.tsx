"use client";

const STEPS = [
  {
    num: "01",
    label: "Post",
    title: "Share your reel",
    desc: "Upload your Instagram reel, story, or post as you normally would. No changes to your content workflow.",
    detail: "Works with Reels, Stories & Posts",
  },
  {
    num: "02",
    label: "Configure",
    title: "Set your keyword",
    desc: "In your TriggerFlow dashboard, paste the reel URL and choose a trigger word — like \"LINK\" or \"ROADMAP\".",
    detail: "Multiple keywords supported",
  },
  {
    num: "03",
    label: "Engage",
    title: "Fans comment",
    desc: "Tell your audience to comment the keyword. They comment, TriggerFlow detects it instantly.",
    detail: "Real-time detection",
  },
  {
    num: "04",
    label: "Automate",
    title: "Replies fire instantly",
    desc: "TriggerFlow sends a public comment reply and a private DM — all within seconds, automatically.",
    detail: "< 0.4s average response",
  },
];

export default function Workflow() {
  return (
    <section id="how-it-works" className="bg-[#F4F1EB] py-32 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6660] mb-3">How it works</p>
            <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-tight text-[#0F0F0F]">
              From post to DM<br />
              <em className="italic text-[#6B6660]">in four steps.</em>
            </h2>
          </div>
          <p className="text-sm text-[#6B6660] max-w-xs leading-relaxed sm:text-right">
            No code. No manual replies. Just set it up once and let TriggerFlow handle the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Connecting line */}
          <div className="hidden sm:block absolute top-8 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-px bg-[#0F0F0F]/[0.08]" />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col gap-5">

                {/* Number bubble */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-[#F4F1EB] border border-[#0F0F0F]/[0.1] flex items-center justify-center flex-shrink-0 group-hover:border-[#0F0F0F]/20 transition-colors">
                  <span className="font-serif text-xl font-normal text-[#0F0F0F]/30">{step.num}</span>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#6B6660] block mb-1">{step.label}</span>
                  <h3 className="font-serif text-lg font-normal text-[#0F0F0F] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#6B6660] leading-relaxed mb-3">{step.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#0F0F0F]/50 bg-[#0F0F0F]/[0.04] border border-[#0F0F0F]/[0.07] px-2.5 py-1 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-[#0F0F0F]/30 inline-block" />
                    {step.detail}
                  </span>
                </div>

                {/* Arrow between steps (mobile) */}
                {i < STEPS.length - 1 && (
                  <div className="sm:hidden flex items-center gap-2 text-[#0F0F0F]/20">
                    <div className="flex-1 h-px bg-[#0F0F0F]/[0.08]" />
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom demo card */}
        <div className="mt-20 bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B6660] mb-2">Live example</p>
            <h3 className="font-serif text-2xl font-normal text-[#0F0F0F] mb-2">
              Comment <em className="italic text-[#6B6660]">"LINK"</em> → get it in your DMs.
            </h3>
            <p className="text-sm text-[#6B6660] leading-relaxed max-w-md">
              A creator posts a reel about their free roadmap. They caption it: <span className="text-[#0F0F0F] font-medium">"Comment LINK to get the free PDF."</span> TriggerFlow handles the rest — instantly, for every single commenter.
            </p>
          </div>

          {/* Mini flow visual */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {[
              { label: "Comment", sub: '"LINK"', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              )},
              { label: "Reply", sub: "0.3s", icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              )},
              { label: "DM sent", sub: "Delivered", icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              )},
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#0F0F0F]/[0.04] border border-[#0F0F0F]/[0.07] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#0F0F0F] uppercase tracking-wide">{item.label}</span>
                  <span className="text-[9px] text-[#6B6660]">{item.sub}</span>
                </div>
                {i < 2 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 flex-shrink-0">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        h2, h3 { font-family: 'Instrument Serif', serif; }
      `}</style>
    </section>
  );
}
