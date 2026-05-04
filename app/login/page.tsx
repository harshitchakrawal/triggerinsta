"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Email/password auth not implemented yet
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#F4F1EB] flex">

      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1000] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0F0F0F] relative overflow-hidden">

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 text-xl font-normal text-white [font-family:'Instrument_Serif',serif]">
          triggerflow
        </Link>

        {/* Center quote */}
        <div className="relative z-10">
          <p className="text-[2.2rem] font-normal leading-[1.2] text-white [font-family:'Instrument_Serif',serif] mb-6">
            "Comment a keyword.<br />
            <em className="italic text-white/50">Get it in your DMs."</em>
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
              HC
            </div>
            <div>
              <p className="text-sm font-medium text-white">triggerflow123</p>
              <p className="text-xs text-white/40">Instagram creator</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex items-center gap-8 border-t border-white/[0.08] pt-8">
          {[
            { value: "50K+", label: "Creators" },
            { value: "10M+", label: "DMs sent" },
            { value: "0.3s", label: "Response" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-normal text-white [font-family:'Instrument_Serif',serif]">{s.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden text-xl font-normal text-[#0F0F0F] [font-family:'Instrument_Serif',serif] mb-10">
          triggerflow
        </Link>

        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-normal text-[#0F0F0F] [font-family:'Instrument_Serif',serif] mb-1">
              Welcome back.
            </h1>
            <p className="text-sm text-[#6B6660]">Sign in to your TriggerFlow account.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white/60 border border-[#0F0F0F]/[0.1] rounded-xl px-4 py-3 text-sm font-medium text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F]/30 transition-all placeholder:text-[#6B6660]/40 backdrop-blur-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660]">Password</label>
                <a href="#" className="text-[10px] text-[#6B6660] hover:text-[#0F0F0F] transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/60 border border-[#0F0F0F]/[0.1] rounded-xl px-4 py-3 text-sm font-medium text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F]/30 transition-all placeholder:text-[#6B6660]/40 backdrop-blur-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6660] hover:text-[#0F0F0F] transition-colors"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F0F0F] text-white font-medium text-sm py-3.5 rounded-full hover:opacity-85 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : "Sign in"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#0F0F0F]/[0.08]" />
            <span className="text-[10px] text-[#6B6660] uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#0F0F0F]/[0.08]" />
          </div>

          {/* Google SSO */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/60 border border-[#0F0F0F]/[0.1] rounded-full py-3 text-sm font-medium text-[#0F0F0F] hover:bg-white/90 transition-all backdrop-blur-sm disabled:opacity-50 relative z-10"
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

          {/* Sign up link */}
          <p className="text-center text-xs text-[#6B6660] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0F0F0F] font-medium hover:underline">
              Sign up free
            </Link>
          </p>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
      `}</style>
    </div>
  );
}
