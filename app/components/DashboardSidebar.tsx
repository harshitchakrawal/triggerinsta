"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${active
        ? "bg-[#f05a28]/10 text-[#f05a28] font-semibold"
        : "text-[#5c5c5c] hover:text-[#1a1a1a] hover:bg-black/[0.04]"
      }`}
  >
    {active && (
      <div className="absolute left-[-24px] w-1.5 h-5 bg-[#f05a28] rounded-r-full" style={{ boxShadow: "0 0 12px rgba(240,90,40,0.4)" }} />
    )}
    <span className={`transition-colors ${active ? "text-[#f05a28]" : "group-hover:text-[#1a1a1a]"}`}>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
  </Link>
);

const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#707070] mb-4">
      {title}
    </h3>
    <div className="flex flex-col gap-1">
      {children}
    </div>
  </div>
);

const DashboardSidebar = () => {
  const pathname = usePathname();

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
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white/90 border-r border-black/[0.07] p-6 flex flex-col z-40 backdrop-blur-sm">
      {/* Logo */}
      <div className="mb-12 px-3">
        <Link href="/" className="flex flex-col group">
          <span className="text-xl font-black text-[#1a1a1a] tracking-tight leading-none mb-1">
            Triggerflow
          </span>
          <span className="text-xs text-[#707070] font-medium tracking-wide">
            Instagram automation
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <SidebarSection key={section.title} title={section.title}>
            {section.items.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </SidebarSection>
        ))}
      </div>

      {/* User Profile */}
      <div className="pt-6 border-t border-black/[0.07] mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#f05a28]/10 flex items-center justify-center text-[#f05a28] font-bold text-sm">
            HC
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[#1a1a1a] truncate group-hover:text-[#f05a28] transition-colors">
              triggerflow123
            </span>
            <span className="text-[10px] text-[#707070] font-medium">Free plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
