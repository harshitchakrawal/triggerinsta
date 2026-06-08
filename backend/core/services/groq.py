"""Groq (LLM) call for AI content suggestions — port of /api/ai/suggestions."""

import re

import requests
from django.conf import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"


def build_prompt(top_posts: list[dict], top_automations: list[dict]) -> str:
    posts_lines = "\n".join(
        f'{i + 1}. {p["type"]} - "{p["caption"][:150]}" '
        f'({p["likes"]} likes, {p["comments"]} comments)'
        for i, p in enumerate(top_posts)
    )
    if top_automations:
        autos_lines = "\n".join(
            f'{i + 1}. Keyword: "{a["keyword"]}" - {a["triggers"]} triggers, '
            f'{a["successRate"]}% success rate'
            for i, a in enumerate(top_automations)
        )
    else:
        autos_lines = "No automations yet"

    return f"""You are an elite Instagram growth strategist with deep expertise in engagement optimization and audience psychology. You have been given real account data — treat every number as signal.

BEFORE generating any output, silently complete this analysis:
- What content format (reel, carousel, single image) dominates the top posts?
- What emotional tone or theme appears repeatedly in high-performing captions?
- What time/context patterns exist across top posts?
- Which automation keywords have the highest success rate, and why might that audience segment respond?
- What's conspicuously MISSING from recent posts that the audience likely wants?

RECENT TOP POSTS:
{posts_lines}

TOP PERFORMING AUTOMATIONS:
{autos_lines}

---

Now generate your recommendation. Every claim must trace back to a specific data point above. Vague statements like "your audience loves engagement" are forbidden — cite actual numbers, actual keywords, actual patterns.

STRICT OUTPUT FORMAT — use these exact labels, no deviation:

TOPIC: [One sharp sentence. Name the specific subject AND the content format (e.g. "carousel", "reel", "talking-head video"). No fluff.]

WHY: [2 sentences max. Lead with a specific stat or pattern from their data — e.g. "Your last 3 carousels averaged 2.4× the likes of single images" or "Posts mentioning [X theme] drove 68% of your DM triggers." Make the causal link explicit.]

CAPTION: [60–90 words. Open with a hook that creates tension, curiosity, or a bold claim — not a question. Match the tone of their highest-performing captions. End with a soft CTA that naturally triggers the recommended keyword (e.g. "Comment [KEYWORD] for..."). Include 4–5 hashtags: 2 niche-specific, 2 mid-tier, 1 broad. No em-dashes. No generic motivational language.]

KEYWORD: [Single word or short phrase. Must appear naturally in the caption CTA. Choose based on the automation success rate data and the emotional intent of this post's audience — explain the choice in STRATEGY, not here.]

STRATEGY: [3 sentences. Sentence 1: what data pattern this post exploits. Sentence 2: why this keyword will convert for THIS audience based on automation data. Sentence 3: what this post sets up for the next content cycle — think in sequences, not one-offs.]"""


def generate_suggestion(top_posts: list[dict], top_automations: list[dict]) -> dict:
    """Call Groq and parse the structured response. Raises RuntimeError on failure."""
    prompt = build_prompt(top_posts, top_automations)
    resp = requests.post(
        GROQ_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        },
        json={
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 1000,
        },
        timeout=60,
    )
    if not resp.ok:
        raise RuntimeError(f"Groq API error: {resp.text}")

    content = (resp.json().get("choices") or [{}])[0].get("message", {}).get("content", "")
    return {
        "suggestion": _parse(content),
        "raw": content,
    }


def _parse(text: str) -> dict:
    def grab(label: str, nxt: str | None) -> str:
        stop = f"(?={nxt}:)" if nxt else "$"
        m = re.search(rf"{label}:\s*([\s\S]+?){stop}", text)
        return m.group(1).strip() if m else ""

    return {
        "topic": grab("TOPIC", "WHY"),
        "why": grab("WHY", "CAPTION"),
        "caption": grab("CAPTION", "KEYWORD"),
        "keyword": grab("KEYWORD", "STRATEGY"),
        "strategy": grab("STRATEGY", None),
    }
