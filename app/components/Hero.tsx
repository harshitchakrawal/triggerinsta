"use client";

import { useDark } from "@/app/lib/useDark";
import Aurora from "@/app/components/Aurora";

export default function HeroPage() {
  const { dark, mounted } = useDark();

  return (
    <div className={`relative min-h-screen font-sans overflow-hidden ${dark ? "text-white" : "text-[#0F0F0F]"}`}>

      {/* Prism — only in hero, only in dark mode */}
      {mounted && dark && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{ animation: "fadeIn 0.6s ease forwards" }}
        >
          <Aurora
            speed={0.6}
            scale={1.5}
            brightness={1}
            color1="#f7f7f7"
            color2="#e100ff"
            noiseFrequency={2.5}
            noiseAmplitude={1}
            bandHeight={0.5}
            bandSpread={1}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1}
            enableMouseInteraction
            mouseInfluence={0.25}
          />
        </div>
      )}

      {/* Grain texture overlay — only in light mode */}
      {!dark && (
        <div
          className="pointer-events-none fixed inset-0 z-[1000] opacity-[0.045]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
            animation: "grain 0.5s steps(1) infinite",
          }}
        />
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-[20vh] text-center overflow-hidden">
        <div className="relative z-[2] animate-[fadeUp_0.7s_ease_both]">
          <h1 className="font-serif text-[clamp(3rem,7.5vw,6rem)] leading-[1.05] tracking-[-0.02em] font-normal max-w-[720px] mx-auto">
            Flows That Move<br />
            <em className={`italic ${dark ? "text-white/50" : "text-[#6B6660]"}`}>At the Speed of Thought.</em>
          </h1>
          <p className={`mt-[1.1rem] text-[0.92rem] max-w-[460px] mx-auto leading-[1.7] font-normal ${dark ? "text-white/60" : "text-[#6B6660]"}`}>
            Transform engagement into action with instant replies and automated DMs triggered by keywords. Scale your communication without scaling your effort.
          </p>
          <button className={`mt-[1.8rem] border-none rounded-full px-[1.6rem] py-3 text-[0.88rem] font-medium cursor-pointer inline-flex items-center gap-2 tracking-[0.01em] hover:opacity-85 hover:-translate-y-px transition-all duration-200 ${dark ? "bg-white text-[#0F0F0F]" : "bg-[#0F0F0F] text-white"}`}>
            Get In Touch <span className="text-base not-italic">↗</span>
          </button>
        </div>
      </section>

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
        h1 { font-family: 'Instrument Serif', serif; }
      `}</style>
    </div>
  );
}
