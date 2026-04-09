"use client";

import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Creators", href: "#creators" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-center h-[72px] relative">
          {/* Logo */}
          <Link href="/" className="absolute left-0 flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tight text-[#f0f4ff]">
              trigger<span className="text-[#00d4aa]">flow</span>
            </span>
          </Link>

          {/* Desktop Nav — pill container centered */}
          <nav className="hidden md:flex items-center bg-white/[0.05] backdrop-blur-md border border-white/[0.08] rounded-full px-2 py-1.5 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-1.5 text-sm font-medium text-[#f0f4ff]/50 hover:text-[#f0f4ff] hover:bg-white/[0.07] rounded-full transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="absolute right-0 hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-[#f0f4ff]/40 hover:text-[#f0f4ff] transition-colors">
              Log In
            </Link>
            <Link href="/dashboard" className="px-5 py-2.5 text-sm font-black text-[#0a0e1a] rounded-full bg-[#00d4aa] shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all">
              Try free demo
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="absolute right-0 md:hidden p-2 rounded-full text-white/60 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-full bg-current rounded-full transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-80 pb-4" : "max-h-0"}`}>
          <div className="bg-[#0a0e1a]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-[#f0f4ff]/60 hover:bg-white/[0.05] rounded-xl transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-white/[0.07]">
              <Link href="/dashboard" className="block w-full text-center px-4 py-2.5 text-sm font-black text-[#0a0e1a] rounded-xl bg-[#00d4aa]">
                Try free demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
