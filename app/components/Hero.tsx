"use client";

console.log("Hello World")

export default function HeroPage() {
  return (
    <div className="relative min-h-screen bg-[#F4F1EB] text-[#0F0F0F] font-sans overflow-x-hidden">

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1000] opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          animation: "grain 0.5s steps(1) infinite",
        }}
      />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-[20vh] text-center overflow-hidden">
        <div className="relative z-[2] animate-[fadeUp_0.7s_ease_both]">
          <h1 className="font-serif text-[clamp(3rem,7.5vw,6rem)] leading-[1.05] tracking-[-0.02em] font-normal max-w-[720px] mx-auto">
            Flows That Move<br />
            <em className="italic text-[#6B6660]">At the Speed of Thought.</em>
          </h1>
          <p className="mt-[1.1rem] text-[0.92rem] text-[#6B6660] max-w-[460px] mx-auto leading-[1.7] font-normal">
            Transform engagement into action with instant replies and automated DMs triggered by keywords. Scale your communication without scaling your effort.
          </p>
          <button className="mt-[1.8rem] bg-[#0F0F0F] text-white border-none rounded-full px-[1.6rem] py-3 text-[0.88rem] font-medium cursor-pointer inline-flex items-center gap-2 tracking-[0.01em] hover:opacity-85 hover:-translate-y-px transition-all duration-200">
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
