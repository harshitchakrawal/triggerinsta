"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useDark } from "@/app/lib/useDark";

const navLinks = [
  { label: "Home", href: "/", section: "" },
  { label: "How it works", href: "#how-it-works", section: "how-it-works" },
  { label: "Pricing", href: "#pricing", section: "pricing" },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";
  const { dark, mounted } = useDark();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);

  const toggleTheme = () => {
    const next = !dark;
    if (next) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  };

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const sectionIds = [...new Set(navLinks.filter(l => l.section).map((l) => l.section))];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {dark && <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0e1a]" />}

      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 py-4 bg-transparent">

        {/* Logo */}
        <div className={`text-[1.2rem] tracking-[0.01em] flex items-center gap-1.5 font-bold [font-family:'Instrument_Serif',serif] ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
          TRIGGERFLOW
        </div>

        {/* Center nav */}
        <div className={`hidden md:flex items-center gap-1 transition-all duration-500 rounded-full px-2 py-1.5 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl border border-[#0F0F0F]/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            : "bg-transparent border border-transparent"
        }`}>
          {navLinks.map((link) => {
            const isActive = link.section ? activeSection === link.section : false;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-[0.82rem] no-underline transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0F0F0F] text-white font-medium"
                    : dark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-[#6B6660] hover:text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.05]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-[#0F0F0F]/[0.1] bg-white/60 hover:bg-white/90 transition-all"
            title={dark ? "Switch to light" : "Switch to dark"}
          >
            {dark ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-[#0F0F0F]/10 animate-pulse" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                {session.user?.image ? (
                  <Image src={session.user.image} alt={session.user.name || "User"} width={34} height={34} className="rounded-full border border-[#0F0F0F]/10" />
                ) : (
                  <div className="w-[34px] h-[34px] rounded-full bg-[#0F0F0F] flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className={`text-[0.82rem] font-medium hidden md:block ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
                  {session.user?.name?.split(" ")[0]}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-[#0F0F0F]/[0.08] rounded-2xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#0F0F0F]/[0.06] mb-1">
                    <p className="text-xs font-bold text-[#0F0F0F] truncate">{session.user?.name}</p>
                    <p className="text-[10px] text-[#6B6660] truncate">{session.user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.04] transition-colors">Dashboard</Link>
                  <Link href="/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.04] transition-colors">Settings</Link>
                  <div className="border-t border-[#0F0F0F]/[0.06] mt-1 pt-1">
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={`text-[0.82rem] hover:opacity-70 transition-colors ${dark ? "text-white" : "text-[#0F0F0F]"}`}>Login</Link>
              <Link href="/signup" className={`text-[0.82rem] hover:opacity-70 transition-colors ${dark ? "text-white" : "text-[#0F0F0F]"}`}>Sign up</Link>
              <Link href="/dashboard" className={`rounded-full px-5 py-2 text-[0.82rem] font-medium hover:opacity-80 transition-opacity duration-200 ${dark ? "bg-white text-[#0F0F0F]" : "bg-[#0F0F0F] text-white"}`}>Try Now</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
