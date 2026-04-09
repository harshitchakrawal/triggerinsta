"use client";

import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex text-[#f0f4ff]">
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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0e1a] transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <DashboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-16 bg-[#0a0e1a]/90 backdrop-blur-md border-b border-white/[0.07] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#f0f4ff] tracking-tight">trigger<span className="text-[#00d4aa]">flow</span></span>
            <span className="text-[10px] text-[#f0f4ff]/30 font-medium">Instagram automation</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-white/70"
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

        <main className="flex-1 overflow-x-hidden overflow-y-auto cross-grid">
          {children}
        </main>
      </div>
    </div>
  );
}
