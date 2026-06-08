"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchInstagramStatus, fetchInstagramMedia, setDisconnected } from "@/app/store/slices/instagramSlice";
import { backendUrl } from "@/app/lib/backend";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon as ChatBubbleOvalLeftIconSolid } from "@heroicons/react/24/solid";

interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface AutomationRule {
  _id: string;
  mediaId: string;
  keyword: string;
  isActive: boolean;
  triggers: number;
}

function MyInstagramPageContent() {
  const dispatch = useAppDispatch();
  const dark = useAppSelector(state => state.theme.dark);
  const { isConnected, account, media, loading, mediaLoading } = useAppSelector(state => state.instagram);
  const searchParams = useSearchParams();

  const [rules, setRules] = React.useState<AutomationRule[]>([]);
  const [disconnecting, setDisconnecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  // Check for success/error from OAuth callback
  React.useEffect(() => {
    const err = searchParams.get('error');
    const success = searchParams.get('success');
    if (err) setError(err === 'access_denied' ? 'Instagram access was denied.' : `Connection failed: ${err}`);
    if (success === 'connected') setSuccessMsg('Instagram connected successfully!');
  }, [searchParams]);

  // Check connection status on mount
  React.useEffect(() => {
    dispatch(fetchInstagramStatus()).then((result: any) => {
      if (result.payload?.isConnected) {
        dispatch(fetchInstagramMedia());
        fetch(backendUrl("/rules")).then(r => r.json()).then(data => {
          if (data.rules) setRules(data.rules);
        });
      }
    });
  }, [dispatch]);

  const handleConnect = () => {
    window.location.href = backendUrl("/auth/instagram");
  };

  const handleToggleRule = async (ruleId: string) => {
    setTogglingId(ruleId);
    try {
      const res = await fetch(backendUrl("/rules"), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId })
      });
      if (res.ok) {
        const data = await res.json();
        setRules(prev => prev.map(r => r._id === ruleId ? { ...r, isActive: data.rule.isActive } : r));
      }
    } catch (err) {
      console.error('Error toggling rule:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch(backendUrl("/instagram/disconnect"), { method: 'POST' });
      if (res.ok) dispatch(setDisconnected());
    } catch (err) {
      console.error('Error disconnecting:', err);
    } finally {
      setDisconnecting(false);
    }
  };

  const cardClass = `border rounded-2xl backdrop-blur-sm ${
    dark ? "bg-white/5 border-white/10" : "bg-white/60 border-[#0F0F0F]/[0.07]"
  }`;

  if (loading) {
    return (
      <section className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${dark ? "border-white" : "border-[#0F0F0F]"}`} />
      </section>
    );
  }

  return (
    <section className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <h1 className={`text-3xl font-normal tracking-tight [font-family:'Instrument_Serif',serif] ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
            My Instagram
          </h1>
          <p className={`text-xs mt-1 font-medium uppercase tracking-widest ${dark ? "text-white/60" : "text-[#6B6660]"}`}>
            Manage your connected Instagram account
          </p>
        </div>

        {/* Success / Error banners */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        {isConnected && account ? (
          <>
            {/* Connected account card */}
            <div className={`flex items-center justify-between mb-8 pb-6 border-b ${
              dark ? "border-white/[0.07]" : "border-[#0F0F0F]/[0.06]"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  dark ? "bg-white/10 text-white" : "bg-[#0F0F0F]/8 text-[#0F0F0F]"
                }`}>
                  {account.username?.[0]?.toUpperCase() || "IG"}
                </div>
                <div>
                  <p className={`text-sm font-medium ${dark ? "text-white" : "text-[#0F0F0F]"}`}>@{account.username}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10">
                  <div className="w-1 h-1 rounded-full bg-green-500" />
                  <span className="text-[10px] font-medium text-green-600">Connected</span>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className={`text-xs font-medium transition-colors disabled:opacity-50 ${
                  dark ? "text-white/40 hover:text-white/70" : "text-[#6B6660] hover:text-red-500"
                }`}
              >
                {disconnecting ? "Disconnecting..." : "Disconnect"}
              </button>
            </div>

            {/* Posts grid */}
            {mediaLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${dark ? "border-white" : "border-[#0F0F0F]"}`} />
              </div>
            ) : media.length > 0 ? (
              <>
                <div className={`flex items-center justify-between mb-6`}>
                  <h3 className={`text-xs font-bold uppercase tracking-widest opacity-50 ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
                    Your posts & reels ({media.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.map((post) => {
                    const imgSrc = post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url;
                    return (
                      <div key={post.id} className={`${cardClass} p-4 group`}>
                        {/* Thumbnail */}
                        <div className={`w-full h-48 rounded-xl mb-3 overflow-hidden relative border ${
                          dark ? "bg-white/[0.04] border-white/[0.07]" : "bg-[#0F0F0F]/[0.04] border-[#0F0F0F]/[0.07]"
                        }`}>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt="Post"
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={dark ? "#ffffff30" : "#0F0F0F30"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="17.5" cy="6.5" r="1" fill={dark ? "#ffffff30" : "#0F0F0F30"} stroke="none" />
                              </svg>
                            </div>
                          )}
                          {/* Video badge */}
                          {post.media_type === "VIDEO" && (
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                              Reel
                            </div>
                          )}
                        </div>

                        {/* Caption */}
                        <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${dark ? "text-white/60" : "text-[#6B6660]"}`}>
                          {post.caption || "No caption"}
                        </p>

                        {/* Stats */}
                        <div className={`flex items-center gap-3 mb-3 text-[10px] font-medium ${dark ? "text-white/40" : "text-[#6B6660]/60"}`}>
                          <span className="flex items-center gap-1">
                            <HeartIcon className="w-3 h-3" />
                            {post.like_count ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <ChatBubbleOvalLeftIconSolid className="w-3 h-3" />
                            {post.comments_count ?? 0}
                          </span>
                          <span className="ml-auto">{new Date(post.timestamp).toLocaleDateString()}</span>
                        </div>

                        {/* Actions */}
                        {(() => {
                          const rule = rules.find(r => r.mediaId === post.id);
                          if (rule) {
                            return (
                              <div className={`rounded-xl p-3 border ${
                                dark ? "bg-white/[0.03] border-white/[0.07]" : "bg-[#0F0F0F]/[0.02] border-[#0F0F0F]/[0.06]"
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${rule.isActive ? "bg-green-500" : "bg-[#6B6660]/40"}`} />
                                    <span className={`text-[10px] font-medium ${
                                      rule.isActive 
                                        ? "text-green-600" 
                                        : dark ? "text-white/40" : "text-[#6B6660]"
                                    }`}>
                                      {rule.isActive ? "Automation active" : "Automation paused"}
                                    </span>
                                  </div>
                                  <span className={`text-[10px] font-medium ${dark ? "text-white/40" : "text-[#6B6660]/60"}`}>
                                    keyword: <span className={`font-bold ${dark ? "text-white/60" : "text-[#0F0F0F]/60"}`}>"{rule.keyword}"</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleRule(rule._id)}
                                    disabled={togglingId === rule._id}
                                    className={`flex-1 text-center text-[11px] font-bold py-2 rounded-lg transition-all disabled:opacity-50 ${
                                      rule.isActive
                                        ? dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-[#0F0F0F]/[0.06] text-[#0F0F0F] hover:bg-[#0F0F0F]/10"
                                        : dark ? "bg-white text-[#0F0F0F] hover:bg-white/90" : "bg-[#0F0F0F] text-white hover:opacity-85"
                                    }`}
                                  >
                                    {togglingId === rule._id ? "..." : rule.isActive ? "Pause" : "Resume"}
                                  </button>
                                  <Link
                                    href={`/dashboard/create?edit=${rule._id}`}
                                    className={`flex-1 text-center text-[11px] font-bold py-2 rounded-lg border transition-all ${
                                      dark ? "border-white/10 text-white/60 hover:bg-white/10" : "border-[#0F0F0F]/10 text-[#6B6660] hover:bg-[#0F0F0F]/5"
                                    }`}
                                  >
                                    Edit
                                  </Link>
                                  <a
                                    href={post.permalink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2 rounded-lg border transition-all ${
                                      dark ? "border-white/10 hover:bg-white/10 text-white/60" : "border-[#0F0F0F]/10 hover:bg-[#0F0F0F]/5 text-[#6B6660]"
                                    }`}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                      <polyline points="15 3 21 3 21 9" />
                                      <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/dashboard/create?reelUrl=${encodeURIComponent(post.permalink)}`}
                                className={`flex-1 text-center text-[11px] font-bold py-2 rounded-lg transition-all ${
                                  dark ? "bg-white text-[#0F0F0F] hover:bg-white/90" : "bg-[#0F0F0F] text-white hover:opacity-85"
                                }`}
                              >
                                Automate this post
                              </Link>
                              <a
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-lg border transition-all ${
                                  dark ? "border-white/10 hover:bg-white/10 text-white/60" : "border-[#0F0F0F]/10 hover:bg-[#0F0F0F]/5 text-[#6B6660]"
                                }`}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </a>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className={`${cardClass} p-16 flex flex-col items-center justify-center text-center`}>
                <h2 className={`text-xl font-normal [font-family:'Instrument_Serif',serif] mb-2 ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
                  No posts found
                </h2>
                <p className={`text-xs font-medium max-w-sm leading-relaxed ${dark ? "text-white/60" : "text-[#6B6660]"}`}>
                  We couldn't find any posts or reels on your connected Instagram account.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Not connected */
          <div className={`${cardClass} p-16 flex flex-col items-center justify-center text-center`}>
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 ${
              dark ? "bg-white/[0.04] border-white/[0.07]" : "bg-[#0F0F0F]/[0.04] border-[#0F0F0F]/[0.07]"
            }`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dark ? "#ffffff60" : "#6B6660"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill={dark ? "#ffffff60" : "#6B6660"} stroke="none" />
              </svg>
            </div>
            <h2 className={`text-2xl font-normal [font-family:'Instrument_Serif',serif] mb-3 ${dark ? "text-white" : "text-[#0F0F0F]"}`}>
              Connect your Instagram
            </h2>
            <p className={`text-sm font-medium max-w-md leading-relaxed mb-8 ${dark ? "text-white/60" : "text-[#6B6660]"}`}>
              Connect your Instagram Business account to see all your posts and reels, and create automated DM responses directly from each post.
            </p>
            <button
              onClick={handleConnect}
              className={`font-medium text-sm px-8 py-4 rounded-full hover:-translate-y-0.5 transition-all active:translate-y-0 hover:opacity-85 flex items-center gap-3 ${
                dark ? "text-[#0F0F0F] bg-white" : "text-white bg-[#0F0F0F]"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Connect Instagram Account
            </button>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
              {[
                { icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", title: "Auto DM Responses", desc: "Send personalized DMs when users comment specific keywords" },
                { icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", title: "Post-level Automations", desc: "Create different automation rules for each post or reel" },
                { icon: "M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z", title: "Real-time Analytics", desc: "Track triggers and conversion rates for all automations" },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center mx-auto mb-3 ${
                    dark ? "bg-white/[0.04] border-white/[0.07]" : "bg-[#0F0F0F]/[0.04] border-[#0F0F0F]/[0.07]"
                  }`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dark ? "#ffffff60" : "#6B6660"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <h3 className={`text-sm font-bold mb-1 ${dark ? "text-white" : "text-[#0F0F0F]"}`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${dark ? "text-white/60" : "text-[#6B6660]"}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </section>
  );
}

export default function MyInstagramPage() {
  return (
    <Suspense>
      <MyInstagramPageContent />
    </Suspense>
  );
}
