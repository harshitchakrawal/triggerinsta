"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDark } from "@/app/lib/useDark";

const SidebarItem = ({
  href,
  icon,
  label,
  active,
  dark,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  dark: boolean;
}) => (
  <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
      active 
        ? dark 
          ? "bg-white/10 text-white font-semibold" 
          : "bg-[#0F0F0F]/8 text-[#0F0F0F] font-semibold"
        : dark
          ? "text-white/60 hover:text-white hover:bg-white/[0.04]"
          : "text-[#6B6660] hover:text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.04]"
    }`}>
    {active && <div className={`absolute left-[-24px] w-1.5 h-5 rounded-r-full ${dark ? "bg-white" : "bg-[#0F0F0F]"}`} />}
    <span className={`transition-colors ${active ? (dark ? "text-white" : "text-[#0F0F0F]") : (dark ? "group-hover:text-white" : "group-hover:text-[#0F0F0F]")}`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </Link>
);

const SidebarSection = ({ title, children, dark }: { title: string; children: React.ReactNode; dark: boolean }) => (
  <div className="mb-8">
    <h3 className={`px-3 text-[10px] font-bold uppercase tracking-widest mb-4 ${dark ? "text-white/30" : "text-[#6B6660]/50"}`}>
      {title}
    </h3>
    <div className="flex flex-col gap-1">
      {children}
    </div>
  </div>
);

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { dark } = useDark();

  const sections = [
    {
      title: "MAIN",
      items: [
        {
          label: "Overview",
          href: "/dashboard",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          ),
        },
        {
          label: "My Instagram",
          href: "/dashboard/instagram",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          ),
        },
        {
          label: "My automations",
          href: "/dashboard/automations",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          ),
        },
        {
          label: "Create new",
          href: "/dashboard/create",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "INSIGHTS",
      items: [
        {
          label: "AI Strategist",
          href: "/dashboard/ai",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          ),
        },
        {
          label: "Analytics",
          href: "/dashboard/analytics",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          ),
        },
        {
          label: "Activity log",
          href: "/dashboard/activity",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        {
          label: "Settings",
          href: "/dashboard/settings",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
        {
          label: "Help",
          href: "/dashboard/help",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 w-72 border-r p-6 flex flex-col z-40 ${
      dark 
        ? "bg-[#0a0e1a] border-white/[0.07]" 
        : "bg-[#F4F1EB] border-[#0F0F0F]/[0.07]"
    }`}>
      {/* Logo */}
      <div className="mb-12 px-3">
        <Link href="/" className="flex flex-col group">
          <span className={`text-xl font-normal tracking-tight leading-none mb-1 [font-family:'Instrument_Serif',serif] ${
            dark ? "text-white" : "text-[#0F0F0F]"
          }`}>
            TriggerInsta
          </span>
          <span className={`text-xs font-medium tracking-wide ${dark ? "text-white/60" : "text-[#6B6660]"}`}>Instagram automation</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {sections.map((section) => (
          <SidebarSection key={section.title} title={section.title} dark={dark}>
            {section.items.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
                dark={dark}
              />
            ))}
          </SidebarSection>
        ))}
      </div>

      {/* User Profile */}
      <div className={`pt-6 border-t mt-auto ${dark ? "border-white/[0.07]" : "border-[#0F0F0F]/[0.07]"}`}>
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer group ${
          dark 
            ? "bg-white/[0.04] hover:bg-white/[0.07]" 
            : "bg-[#0F0F0F]/[0.04] hover:bg-[#0F0F0F]/[0.07]"
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            dark ? "bg-white/8 text-white" : "bg-[#0F0F0F]/8 text-[#0F0F0F]"
          }`}>
            HC
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-sm font-bold truncate transition-colors ${
              dark 
                ? "text-white group-hover:text-white/60" 
                : "text-[#0F0F0F] group-hover:text-[#6B6660]"
            }`}>TriggerInsta123</span>
            <span className={`text-[10px] font-medium ${dark ? "text-white/60" : "text-[#6B6660]"}`}>Free plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
