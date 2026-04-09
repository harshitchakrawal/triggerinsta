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
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.06] hover:border-[#00d4aa]/20 transition-all group backdrop-blur-sm">
    <div className="w-16 h-16 rounded-xl bg-[#f05a28]/10 border border-black/[0.06] flex items-center justify-center relative overflow-hidden flex-shrink-0">
      {thumbnailUrl ? (
        <img 
          src={`/api/proxy-image?url=${encodeURIComponent(thumbnailUrl)}`}
          alt="Thumbnail" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : null}
      {!thumbnailUrl && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(240,90,40,0.4)" stroke="#f05a28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-[#f0f4ff] truncate mb-1">{title}</h4>
      <p className="text-[11px] text-[#f0f4ff]/40 font-medium leading-tight">
        Keyword: <span className="text-[#00d4aa]/70">"{keyword}"</span> • {triggers} triggers
      </p>
    </div>
    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${status === "Active" ? "bg-[#f05a28]/10 text-[#f05a28]" : "bg-black/[0.05] text-[#707070]"}`}>
      {status}
    </span>
  </div>
);
