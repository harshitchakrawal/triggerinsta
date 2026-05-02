'use client';

import { useDark } from "@/app/lib/useDark";

export const ReelCard = ({
  title,
  keyword,
  triggers,
  status = "Active",
  mediaId,
  thumbnailUrl
}: {
  title: string;
  keyword: string;
  triggers: number;
  status?: "Active" | "Paused";
  mediaId?: string;
  thumbnailUrl?: string;
}) => {
  const { dark } = useDark();
  
  // Prefer fresh fetch via mediaId, fallback to stored thumbnailUrl
  const imgSrc = mediaId
    ? `/api/proxy-image?mediaId=${encodeURIComponent(mediaId)}`
    : thumbnailUrl
    ? `/api/proxy-image?url=${encodeURIComponent(thumbnailUrl)}`
    : null;

  return (
    <div className={`border rounded-2xl p-4 flex items-center gap-4 transition-all group backdrop-blur-sm ${
      dark 
        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" 
        : "bg-white/60 border-[#0F0F0F]/[0.07] hover:bg-white/80 hover:border-[#0F0F0F]/10"
    }`}>
      <div className={`w-16 h-16 rounded-xl border flex items-center justify-center relative overflow-hidden flex-shrink-0 ${
        dark 
          ? "bg-white/[0.06] border-white/[0.08]" 
          : "bg-[#0F0F0F]/[0.06] border-[#0F0F0F]/[0.08]"
      }`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="Thumbnail"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={dark ? "rgba(255,255,255,0.15)" : "rgba(15,15,15,0.15)"} stroke={dark ? "#ffffff60" : "#6B6660"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-bold truncate mb-1 [font-family:'Instrument_Serif',serif] ${
          dark ? "text-white" : "text-[#0F0F0F]"
        }`}>{title}</h4>
        <p className={`text-[11px] font-medium leading-tight ${
          dark ? "text-white/60" : "text-[#6B6660]"
        }`}>
          Keyword: <span className={dark ? "text-white/70" : "text-[#0F0F0F]/70"}>"{keyword}"</span> • {triggers} triggers
        </p>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
        status === "Active" 
          ? dark 
            ? "bg-white/10 text-white border-white/20" 
            : "bg-[#0F0F0F]/8 text-[#0F0F0F] border-[#0F0F0F]/10"
          : dark
            ? "bg-white/[0.04] text-white/60 border-white/[0.07]"
            : "bg-[#0F0F0F]/[0.04] text-[#6B6660] border-[#0F0F0F]/[0.07]"
      }`}>
        {status}
      </span>
    </div>
  );
}
