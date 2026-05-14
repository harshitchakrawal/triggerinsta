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
  { label: "Help", href: "#faq", section: "faq" },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";
  const { dark } = useDark();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);

  const toggleTheme = () => {
    const next = !dark;
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const t = (light: string, d: string) => (dark ? d : light);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY < 120) setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const sectionIds = [...new Set(navLinks.filter((l) => l.section).map((l) => l.section))];
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

      <nav
        className={`fixed top-3 left-4 right-4 md:left-8 md:right-8 z-[100] rounded-xl transition-all duration-300 ${
          t("bg-[#F4F1EB]/80", "bg-[#0a0e1a]/80")
        } backdrop-blur-xl ${
          scrolled
            ? t(
                "border border-[#0F0F0F]/10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
                "border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
              )
            : "border border-transparent"
        }`}
      >
        <div className="w-full px-5 md:px-8 flex items-center justify-between h-[58px]">

          {/* Logo */}
          <Link
            href="/"
            className={`text-[1.1rem] tracking-widest font-bold [font-family:'Instrument_Serif',serif] flex items-center gap-2 select-none ${
              dark ? "text-white" : "text-[#0F0F0F]"
            }`}
          >
            TRIGGERFLOW
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = link.section ? activeSection === link.section : false;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-[0.8rem] no-underline transition-all duration-200 cursor-pointer font-medium ${
                    isActive
                      ? t(
                          "text-[#0F0F0F] bg-[#0F0F0F]/[0.07]",
                          "text-white bg-white/10"
                        )
                      : t(
                          "text-[#6B6660] hover:text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.05]",
                          "text-white/50 hover:text-white hover:bg-white/[0.07]"
                        )
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${t(
                "text-[#6B6660] hover:text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.06]",
                "text-white/40 hover:text-white hover:bg-white/[0.08]"
              )}`}
              title={dark ? "Switch to light" : "Switch to dark"}
            >
              {dark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Divider */}
            <div className={`h-5 w-px ${t("bg-[#0F0F0F]/10", "bg-white/10")}`} />

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#0F0F0F]/10 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className={`rounded-full border ${t("border-[#0F0F0F]/10", "border-white/10")}`}
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${t("bg-[#0F0F0F] text-white", "bg-white text-[#0F0F0F]")}`}>
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className={`text-[0.82rem] font-medium hidden md:block ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={dark ? "rgba(255,255,255,0.4)" : "#9ca3af"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className={`absolute right-0 top-[calc(100%+10px)] w-52 rounded-xl shadow-xl py-1.5 z-50 ${t(
                    "bg-white border border-[#0F0F0F]/[0.08]",
                    "bg-[#111827] border border-white/[0.07]"
                  )}`}>
                    <div className={`px-4 py-2.5 border-b ${t("border-[#0F0F0F]/[0.06]", "border-white/[0.05]")}`}>
                      <p className={`text-xs font-semibold truncate ${t("text-[#0F0F0F]", "text-white")}`}>{session.user?.name}</p>
                      <p className={`text-[10px] truncate mt-0.5 ${t("text-[#6B6660]", "text-white/50")}`}>{session.user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2 text-[0.82rem] transition-colors ${t(
                          "text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.04]",
                          "text-white/80 hover:bg-white/[0.05]"
                        )}`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2 text-[0.82rem] transition-colors ${t(
                          "text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.04]",
                          "text-white/80 hover:bg-white/[0.05]"
                        )}`}
                      >
                        Settings
                      </Link>
                    </div>
                    <div className={`border-t pt-1 ${t("border-[#0F0F0F]/[0.06]", "border-white/[0.05]")}`}>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={`w-full text-left flex items-center gap-2.5 px-4 py-2 text-[0.82rem] text-red-500 transition-colors ${t("hover:bg-red-50", "hover:bg-red-500/10")}`}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`text-[0.82rem] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${t(
                    "text-[#3d3d3d] hover:bg-[#0F0F0F]/[0.05]",
                    "text-white/70 hover:text-white hover:bg-white/[0.07]"
                  )}`}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={`text-[0.82rem] font-medium px-4 py-1.5 rounded-lg transition-all duration-200 border ${t(
                    "text-[#0F0F0F] border-[#0F0F0F]/20 hover:bg-[#0F0F0F]/[0.05]",
                    "text-white border-white/20 hover:bg-white/[0.07]"
                  )}`}
                >
                  Sign up
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-[0.82rem] font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 ${
                    dark
                      ? "bg-white text-[#0F0F0F] hover:bg-white/90"
                      : "bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/85"
                  }`}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
