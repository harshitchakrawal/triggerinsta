"use client";

import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import { useDark } from "@/app/lib/useDark";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { dark } = useDark();

  return (
    <div className={`min-h-screen flex ${dark ? "bg-[#0a0e1a] text-white" : "bg-[#F4F1EB] text-[#0F0F0F]"}`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${dark ? "bg-[#0a0e1a]" : "bg-[#F4F1EB]"}`}
      >
        <DashboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className={`lg:hidden h-16 backdrop-blur-md border-b flex items-center justify-between px-6 sticky top-0 z-30 ${
          dark 
            ? "bg-[#0a0e1a]/90 border-white/[0.07]" 
            : "bg-[#F4F1EB]/90 border-[#0F0F0F]/[0.07]"
        }`}>
          <div className="flex flex-col">
            <span className={`text-sm font-normal tracking-tight [font-family:'Instrument_Serif',serif] ${
              dark ? "text-white" : "text-[#0F0F0F]"
            }`}>TriggerInsta</span>
            <span className={`text-[10px] font-medium ${dark ? "text-white/60" : "text-[#6B6660]"}`}>Instagram automation</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 -mr-2 ${dark ? "text-white/70" : "text-[#0F0F0F]/70"}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </header>

        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${dark ? "bg-[#0a0e1a]" : "bg-[#F4F1EB]"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
