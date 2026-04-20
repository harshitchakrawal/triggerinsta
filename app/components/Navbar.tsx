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
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 py-[1.1rem] bg-transparent">
        <div className="text-[1.2rem] text-[#0F0F0F] tracking-[0.01em] flex items-center gap-1.5 font-bold [font-family:'Instrument_Serif',serif]">
          TRIGGERFLOW
        </div>
        <ul className="hidden md:flex items-center gap-8 list-none text-[0.82rem] text-white/50">
          <li><a href="#how-it-works" className="text-[#0F0F0F] no-underline hover:text-[#6B6660] transition-colors cursor-pointer">Workflow</a></li>
          <li><a href="#how-it-works" className="text-[#0F0F0F] no-underline hover:text-[#6B6660] transition-colors cursor-pointer">Features</a></li>
          <li><a href="#pricing" className="text-[#0F0F0F] no-underline hover:text-[#6B6660] transition-colors cursor-pointer">Pricing</a></li>
        </ul>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[0.82rem] text-[#0F0F0F] bg-transparent border-none cursor-pointer hover:text-[#6B6660] transition-colors">
            Login
          </Link>
          <Link href="/dashboard" className="bg-[#0F0F0F] text-white border-none rounded-full px-5 py-2 text-[0.82rem] font-medium cursor-pointer hover:opacity-80 transition-opacity duration-200">
            Try Now
          </Link>
        </div>
      </nav>
  );
};

export default Navbar;
