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
          <li><a href="#" className="text-[#0F0F0F] no-underline">Workflows</a></li>
          <li><a href="#" className="text-[#0F0F0F] no-underline">Integrations</a></li>
          <li><a href="#" className="text-[#0F0F0F] no-underline">Pricing</a></li>
        </ul>
        <div className="flex items-center gap-8">
          <button className="text-[0.82rem] text-[#0F0F0F] bg-transparent border-none cursor-pointer ">
            Login
          </button>
          <Link href="/dashboard" className="bg-[#0F0F0F] text-white border-none rounded-full px-5 py-2 text-[0.82rem] font-medium cursor-pointer hover:opacity-80 transition-opacity duration-200">
            Try Now
          </Link>
        </div>
      </nav>
  );
};

export default Navbar;
