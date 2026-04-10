'use client';

export const ReelCard = ({
  title,
  keyword,
  triggers,
  status = "Active",
  thumbnailUrl
}: {
  title: string;
  keyword: string;
  triggers: number;
  status?: "Active" | "Paused";
  thumbnailUrl?: string;
}) => (
  <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl p-4 flex items-center gap-4 hover:bg-white/80 hover:border-[#0F0F0F]/10 transition-all group backdrop-blur-sm">
    <div className="w-16 h-16 rounded-xl bg-[#0F0F0F]/[0.06] border border-[#0F0F0F]/[0.08] flex items-center justify-center relative overflow-hidden flex-shrink-0">
      {thumbnailUrl ? (
        <img
          src={`/api/proxy-image?url=${encodeURIComponent(thumbnailUrl)}`}
          alt="Thumbnail"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(15,15,15,0.15)" stroke="#6B6660" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-[#0F0F0F] truncate mb-1 [font-family:'Instrument_Serif',serif]">{title}</h4>
      <p className="text-[11px] text-[#6B6660] font-medium leading-tight">
        Keyword: <span className="text-[#0F0F0F]/70">"{keyword}"</span> • {triggers} triggers
      </p>
    </div>
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${status === "Active" ? "bg-[#0F0F0F]/8 text-[#0F0F0F] border border-[#0F0F0F]/10" : "bg-[#0F0F0F]/[0.04] text-[#6B6660] border border-[#0F0F0F]/[0.07]"}`}>
      {status}
    </span>
  </div>
);
