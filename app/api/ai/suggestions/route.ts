import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user?.instagramConnected) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 400 });
    }

    // Fetch user's Instagram media
    const mediaRes = await fetch(`${process.env.NEXTAUTH_URL}/api/instagram/media`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
    });
    const mediaData = await mediaRes.json();
    const media = mediaData.media || [];

    // Fetch automation rules
    const rules = await prisma.automationRule.findMany({
      orderBy: { triggers: "desc" },
      take: 10,
    });

    // Prepare data for AI
    const topPosts = media.slice(0, 5).map((p: any) => ({
      caption: p.caption || "No caption",
      likes: p.like_count || 0,
      comments: p.comments_count || 0,
      type: p.media_type,
    }));

    const topAutomations = rules.slice(0, 3).map((r) => ({
      keyword: r.keyword,
      triggers: r.triggers,
      successRate: r.triggers > 0 ? Math.round((r.repliesSent / r.triggers) * 100) : 0,
    }));

    const prompt = `You are an elite Instagram growth strategist with deep expertise in engagement optimization and audience psychology. You have been given real account data — treat every number as signal.

BEFORE generating any output, silently complete this analysis:
- What content format (reel, carousel, single image) dominates the top posts?
- What emotional tone or theme appears repeatedly in high-performing captions?
- What time/context patterns exist across top posts?
- Which automation keywords have the highest success rate, and why might that audience segment respond?
- What's conspicuously MISSING from recent posts that the audience likely wants?

RECENT TOP POSTS:
${topPosts.map((p: { type: string; caption: string; likes: number; comments: number }, i: number) => `${i + 1}. ${p.type} - "${p.caption.slice(0, 150)}" (${p.likes} likes, ${p.comments} comments)`).join("\n")}

TOP PERFORMING AUTOMATIONS:
${topAutomations.length > 0 ? topAutomations.map((a, i) => `${i + 1}. Keyword: "${a.keyword}" - ${a.triggers} triggers, ${a.successRate}% success rate`).join("\n") : "No automations yet"}

---

Now generate your recommendation. Every claim must trace back to a specific data point above. Vague statements like "your audience loves engagement" are forbidden — cite actual numbers, actual keywords, actual patterns.

STRICT OUTPUT FORMAT — use these exact labels, no deviation:

TOPIC: [One sharp sentence. Name the specific subject AND the content format (e.g. "carousel", "reel", "talking-head video"). No fluff.]

WHY: [2 sentences max. Lead with a specific stat or pattern from their data — e.g. "Your last 3 carousels averaged 2.4× the likes of single images" or "Posts mentioning [X theme] drove 68% of your DM triggers." Make the causal link explicit.]

CAPTION: [60–90 words. Open with a hook that creates tension, curiosity, or a bold claim — not a question. Match the tone of their highest-performing captions. End with a soft CTA that naturally triggers the recommended keyword (e.g. "Comment [KEYWORD] for..."). Include 4–5 hashtags: 2 niche-specific, 2 mid-tier, 1 broad. No em-dashes. No generic motivational language.]

KEYWORD: [Single word or short phrase. Must appear naturally in the caption CTA. Choose based on the automation success rate data and the emotional intent of this post's audience — explain the choice in STRATEGY, not here.]

STRATEGY: [3 sentences. Sentence 1: what data pattern this post exploits. Sentence 2: why this keyword will convert for THIS audience based on automation data. Sentence 3: what this post sets up for the next content cycle — think in sequences, not one-offs.]`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!groqRes.ok) {
      const error = await groqRes.text();
      console.error("Groq API error:", error);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const groqData = await groqRes.json();
    const aiResponse = groqData.choices[0]?.message?.content || "";

    // Parse AI response
    const topicMatch = aiResponse.match(/TOPIC:\s*([\s\S]+?)(?=WHY:)/);
    const whyMatch = aiResponse.match(/WHY:\s*([\s\S]+?)(?=CAPTION:)/);
    const captionMatch = aiResponse.match(/CAPTION:\s*([\s\S]+?)(?=KEYWORD:)/);
    const keywordMatch = aiResponse.match(/KEYWORD:\s*([\s\S]+?)(?=STRATEGY:)/);
    const strategyMatch = aiResponse.match(/STRATEGY:\s*([\s\S]+?)$/);

    return NextResponse.json({
      success: true,
      suggestion: {
        topic: topicMatch?.[1]?.trim() || "",
        why: whyMatch?.[1]?.trim() || "",
        caption: captionMatch?.[1]?.trim() || "",
        keyword: keywordMatch?.[1]?.trim() || "",
        strategy: strategyMatch?.[1]?.trim() || "",
      },
      raw: aiResponse,
    });
  } catch (error: any) {
    console.error("[AI suggestions]", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
