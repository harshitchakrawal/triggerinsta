"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export default function SignupPage() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [igLoading, setIgLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleInstagramSignUp = async () => {
    setIgLoading(true);
    const res = await fetch("/api/auth/instagram/url?flow=login");
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#F4F1EB] flex">
      <div
        className="pointer-events-none fixed inset-0 z-[1000] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0F0F0F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <Link href="/" className="relative z-10 text-xl font-normal text-white [font-family:'Instrument_Serif',serif]">
          TriggerInsta
        </Link>
        <div className="relative z-10">
          <p className="text-[2.2rem] font-normal leading-[1.2] text-white [font-family:'Instrument_Serif',serif] mb-6">
            "Set it once.<br />
            <em className="italic text-white/50">Let it run forever."</em>
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">HC</div>
            <div>
              <p className="text-sm font-medium text-white">TriggerInsta123</p>
              <p className="text-xs text-white/40">Instagram creator</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-8 border-t border-white/[0.08] pt-8">
          {[{ value: "50K+", label: "Creators" }, { value: "10M+", label: "DMs sent" }, { value: "0.3s", label: "Response" }].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-normal text-white [font-family:'Instrument_Serif',serif]">{s.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <Link href="/" className="lg:hidden text-xl font-normal text-[#0F0F0F] [font-family:'Instrument_Serif',serif] mb-10">
          TriggerInsta
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-normal text-[#0F0F0F] [font-family:'Instrument_Serif',serif] mb-1">Create your account.</h1>
            <p className="text-sm text-[#6B6660]">Start automating your Instagram in minutes.</p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Instagram */}
            <button
              onClick={handleInstagramSignUp}
              disabled={igLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full text-sm font-medium text-white transition-all disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
            >
              {igLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><InstagramIcon />Continue with Instagram</>
              )}
            </button>

            {/* Google */}
            <button
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white/60 border border-[#0F0F0F]/[0.1] rounded-full py-3.5 text-sm font-medium text-[#0F0F0F] hover:bg-white/90 hover:-translate-y-0.5 transition-all backdrop-blur-sm disabled:opacity-50"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-[#0F0F0F]/20 border-t-[#0F0F0F] rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          <p className="text-center text-xs text-[#6B6660] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0F0F0F] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </div>
  );
}
