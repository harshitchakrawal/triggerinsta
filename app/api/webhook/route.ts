import axios from "axios";
import { connectDB } from "@/app/lib/mongodb";
import { AutomationRule } from "@/app/models/AutomationRule";
import { ProcessedComment } from "@/app/models/ProcessedComment";

const VERIFY_TOKEN = "triggerflow123";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Verification failed", { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[webhook] Received:", JSON.stringify(body, null, 2));

  // Always respond 200 immediately so Meta doesn't retry
  if (body.object !== "instagram") {
    console.log("[webhook] Not instagram object, skipping");
    return new Response("EVENT_RECEIVED", { status: 200 });
  }

  await connectDB();

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      console.log("[webhook] Change field:", change.field);

      if (change.field !== "comments") continue;

      const comment = change.value;
      const mediaId = comment.media?.id;
      const commentText = comment.text?.toLowerCase().trim();
      const commenterId = comment.from?.id;
      const commentId = comment.id;

      console.log("[webhook] Comment data:", { mediaId, commentText, commenterId, commentId });

      if (!mediaId || !commentText || !commenterId || !commentId) {
        console.log("[webhook] Missing required fields, skipping");
        continue;
      }

      // Step 1 — find active rule for this media
      const rule = await AutomationRule.findOne({ mediaId, isActive: true });
      if (!rule) {
        console.log("[webhook] No active rule for mediaId:", mediaId);
        const allRules = await AutomationRule.find({ isActive: true });
        console.log("[webhook] Active rule mediaIds in DB:", allRules.map(r => r.mediaId));
        continue;
      }

      console.log("[webhook] Rule found:", rule._id, "| keywords:", rule.keyword);

      // Step 2 — keyword check (supports comma-separated keywords)
      const keywords = rule.keyword.split(",").map((k: string) => k.trim().toLowerCase());
      const matched = keywords.some((kw: string) => commentText.includes(kw));
      if (!matched) {
        console.log("[webhook] No keyword match. Comment:", commentText, "| Keywords:", keywords);
        continue;
      }

      console.log("[webhook] Keyword matched!");

      // Step 3 — deduplication
      const dedupKey = `${commenterId}:${mediaId}`;
      const already = await ProcessedComment.findOne({ dedupKey });
      if (already) {
        console.log("[webhook] Already replied to this user on this reel, skipping");
        continue;
      }

      // Step 4 — send comment reply
      const commentSuccess = await replyToComment(commentId, rule.replyToComment);

      // Step 5 — send DM
      const dmSuccess = await sendInstagramDM(commenterId, rule.replyToDM);

      // Step 6 — fetch username
      let actualUsername = comment.from?.username || comment.from?.name || "unknown";
      try {
        if (actualUsername === "unknown") {
          const res = await axios.get(
            `https://graph.facebook.com/v19.0/${commentId}?fields=from{username}`,
            { params: { access_token: PAGE_ACCESS_TOKEN } }
          );
          actualUsername = res.data?.from?.username || commenterId;
        }
      } catch {
        actualUsername = commenterId;
      }

      // Step 7 — save to DB
      try {
        await ProcessedComment.create({ dedupKey, ruleId: rule._id, username: actualUsername, commentText });
      } catch (err: any) {
        if (err.code === 11000) {
          console.log("[webhook] Duplicate dedupKey race condition, skipping");
          continue;
        }
        throw err;
      }

      // Step 8 — update stats
      await AutomationRule.findByIdAndUpdate(rule._id, {
        $inc: {
          triggers: 1,
          repliesSent: (commentSuccess || dmSuccess) ? 1 : 0,
        },
        $set: { lastTriggeredAt: new Date() },
      });

      console.log(`[webhook] Comment reply: ${commentSuccess ? "OK" : "FAILED"}`);
      console.log(`[webhook] Instagram DM:  ${dmSuccess ? "OK" : "FAILED (needs approval)"}`);
    }
  }

  return new Response("EVENT_RECEIVED", { status: 200 });
}

async function replyToComment(commentId: string, message: string): Promise<boolean> {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${commentId}/replies`,
      { message },
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );
    console.log("[webhook] Comment reply sent");
    return true;
  } catch (err: any) {
    console.error("[webhook] Comment reply failed:", err.response?.data ?? err.message);
    return false;
  }
}

async function sendInstagramDM(userId: string, message: string): Promise<boolean> {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PAGE_ID}/messages`,
      {
        recipient: { id: userId },
        message: { text: message },
        messaging_type: "RESPONSE",
      },
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );
    console.log("[webhook] Instagram DM sent");
    return true;
  } catch (err: any) {
    console.error("[webhook] Instagram DM failed:", err.response?.data ?? err.message);
    return false;
  }
}
