"use client";

import React, { useState } from "react";
import { useDark } from "@/app/lib/useDark";
import { backendUrl } from "@/app/lib/backend";

interface AISuggestion {
  topic: string;
  why: string;
  caption: string;
  keyword: string;
  strategy: string;
}

export default function AIStrategistPage() {
  const { dark } = useDark();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setSuggestion(null);

    const steps = [
      "Fetching your Instagram posts...",
      "Analyzing engagement patterns...",
      "Reviewing automation performance...",
      "Identifying successful content themes...",
      "Generating personalized strategy...",
    ];

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
        stepIndex++;
      }
    }, 1200);

    try {
      const res = await fetch(backendUrl("/ai/suggestions"), {
        method: "POST",
        credentials: "include",
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate suggestions");
      }

      const data = await res.json();
      setSuggestion(data.suggestion);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const text = dark ? "text-white" : "text-[#0F0F0F]";
  const muted = dark ? "text-white/60" : "text-[#6B6660]";
  const card = dark ? "bg-white/5 border-white/10" : "bg-white/60 border-[#0F0F0F]/[0.07]";

  return (
    <section className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border ${card}`}>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
            <span className={`text-xs font-bold uppercase tracking-wide ${muted}`}>AI Powered</span>
          </div>
          <h1 className={`text-4xl font-normal tracking-tight mb-3 [font-family:'Instrument_Serif',serif] ${text}`}>
            Your AI Content Strategist
          </h1>
          <p className={`text-sm font-medium max-w-2xl mx-auto leading-relaxed ${muted}`}>
            Analyzes your posts, engagement patterns, and automation performance to suggest your next winning content idea
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`border rounded-3xl p-16 mb-8 ${card}`}>
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className={`w-16 h-16 border-4 rounded-full animate-spin ${dark ? "border-white/10 border-t-white" : "border-[#0F0F0F]/10 border-t-[#0F0F0F]"}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className={`text-base font-medium mb-2 ${text}`}>{loadingStep}</p>
                <p className={`text-xs ${muted}`}>This may take 10-15 seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-8 flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 text-sm font-medium px-6 py-4 rounded-2xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Results */}
        {suggestion && !loading && (
          <div className="space-y-6 mb-8">
            {/* Topic Card */}
            <div className={`border rounded-2xl p-8 ${card}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? "bg-white/10" : "bg-[#0F0F0F]/8"}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${text}`}>Next Post Idea</h3>
                    <p className={`text-xs ${muted}`}>AI-generated based on your data</p>
                  </div>
                </div>
              </div>
              <p className={`text-xl font-normal leading-relaxed mb-4 [font-family:'Instrument_Serif',serif] ${text}`}>
                {suggestion.topic}
              </p>
              <div className={`border-t pt-4 ${dark ? "border-white/10" : "border-[#0F0F0F]/[0.07]"}`}>
                <p className={`text-sm font-medium ${muted}`}>{suggestion.why}</p>
              </div>
            </div>

            {/* Caption Card */}
            <div className={`border rounded-2xl p-8 ${card}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? "bg-white/10" : "bg-[#0F0F0F]/8"}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${text}`}>Caption Draft</h3>
                    <p className={`text-xs ${muted}`}>Ready to copy & paste</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(suggestion.caption)}
                  className={`text-xs font-medium px-4 py-2 rounded-lg border transition-all ${dark ? "border-white/10 text-white/60 hover:bg-white/10" : "border-[#0F0F0F]/10 text-[#6B6660] hover:bg-[#0F0F0F]/5"}`}
                >
                  Copy
                </button>
              </div>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${text}`}>
                {suggestion.caption}
              </p>
            </div>

            {/* Keyword + Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Keyword */}
              <div className={`border rounded-2xl p-8 ${card}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? "bg-white/10" : "bg-[#0F0F0F]/8"}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${text}`}>Automation Keyword</h3>
                    <p className={`text-xs ${muted}`}>Trigger word for DMs</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-black [font-family:'Instrument_Serif',serif] ${text}`}>
                    "{suggestion.keyword}"
                  </span>
                  <button
                    onClick={() => copyToClipboard(suggestion.keyword)}
                    className={`text-xs font-medium px-4 py-2 rounded-lg border transition-all ${dark ? "border-white/10 text-white/60 hover:bg-white/10" : "border-[#0F0F0F]/10 text-[#6B6660] hover:bg-[#0F0F0F]/5"}`}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Strategy */}
              <div className={`border rounded-2xl p-8 ${card}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? "bg-white/10" : "bg-[#0F0F0F]/8"}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${text}`}>Why This Works</h3>
                    <p className={`text-xs ${muted}`}>Based on your stats</p>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${muted}`}>
                  {suggestion.strategy}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className={`border rounded-2xl p-8 text-center ${card}`}>
              <p className={`text-sm font-medium mb-4 ${muted}`}>
                Ready to create this automation?
              </p>
              <button
                onClick={() => window.location.href = "/dashboard/create"}
                className={`font-medium text-sm px-8 py-4 rounded-full hover:-translate-y-0.5 transition-all ${dark ? "bg-white text-[#0F0F0F]" : "bg-[#0F0F0F] text-white"}`}
              >
                Create Automation →
              </button>
            </div>
          </div>
        )}

        {/* Initial CTA */}
        {!loading && !suggestion && !error && (
          <div className={`border rounded-3xl p-16 text-center ${card}`}>
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 mx-auto mb-6 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </div>
              <h2 className={`text-2xl font-normal mb-4 [font-family:'Instrument_Serif',serif] ${text}`}>
                Get Your Personalized Content Strategy
              </h2>
              <p className={`text-sm leading-relaxed mb-8 ${muted}`}>
                Our AI will analyze your Instagram posts, engagement metrics, and automation performance to craft a data-driven content recommendation just for you.
              </p>
              <button
                onClick={handleAnalyze}
                className={`font-bold text-sm px-10 py-5 rounded-full hover:-translate-y-0.5 transition-all shadow-lg ${dark ? "bg-white text-[#0F0F0F]" : "bg-[#0F0F0F] text-white"}`}
              >
                🪄 Analyze My Account
              </button>
            </div>
          </div>
        )}

        {/* Regenerate */}
        {suggestion && !loading && (
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              className={`text-sm font-medium px-6 py-3 rounded-full border transition-all ${dark ? "border-white/10 text-white/60 hover:bg-white/10" : "border-[#0F0F0F]/10 text-[#6B6660] hover:bg-[#0F0F0F]/5"}`}
            >
              ↻ Generate New Suggestion
            </button>
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </section>
  );
}
