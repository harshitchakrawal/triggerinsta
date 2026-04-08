// app/api/webhook/route.ts
import axios from "axios";
import { connectDB } from "@/app/lib/mongodb";
import { AutomationRule } from "@/app/models/AutomationRule";
import { ProcessedComment } from "@/app/models/ProcessedComment";

const VERIFY_TOKEN = "triggerflow123";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN!;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!;

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
  console.log("Webhook received:", JSON.stringify(body, null, 2));

  if (body.object !== "instagram") {
    return new Response("EVENT_RECEIVED", { status: 200 });
  }

  await connectDB();

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "comments") continue;

      const comment = change.value;
      const mediaId = comment.media?.id;
      const commentText = comment.text?.toLowerCase().trim();
      const commenterId = comment.from?.id;
      const commentId = comment.id;

      if (!mediaId || !commentText || !commenterId || !commentId) continue;

      // Step 1 - find active rule
      const rule = await AutomationRule.findOne({ mediaId, isActive: true });
      if (!rule) continue;

      // Step 2 - keyword check
      if (!commentText.includes(rule.keyword.toLowerCase())) continue;

      // Step 3 - dedup check
      const dedupKey = `${commenterId}:${mediaId}`;
      const already = await ProcessedComment.findOne({ dedupKey });
      if (already) continue;

      // Step 4 - send comment reply
      const commentSuccess = await replyToComment(commentId, rule.replyToComment);

      // Step 5 - send DM
      const dmSuccess = await sendInstagramDM(commenterId, rule.replyToDM);

      // Step 6 - fetch real username and save dedup + update stats ✅ ONLY place stats are updated
      let actualUsername = comment.from?.username || comment.from?.name || "unknown";
      
      try {
        if (actualUsername === "unknown") {
          // Instagram webhooks usually only send the from.id, so we must fetch the username manually
          const res = await axios.get(`https://graph.facebook.com/v19.0/${commentId}?fields=from{username}`, {
            params: { access_token: PAGE_ACCESS_TOKEN }
          });
          if (res.data?.from?.username) {
            actualUsername = res.data.from.username;
          } else {
            actualUsername = commenterId; // Fallback to ID if fetch succeeds but username missing
          }
        }
        await ProcessedComment.create({ dedupKey, ruleId: rule._id, username: actualUsername, commentText });
      } catch (err: any) {
        if (err.code === 11000) {
          console.log("Duplicate dedupKey, skipping stats update");
          continue; // ← prevents stats update if dedup already exists
        }
        throw err;
      }

      await AutomationRule.findByIdAndUpdate(rule._id, {
        $inc: {
          triggers: 1,
          repliesSent: commentSuccess || dmSuccess ? 1 : 0,
        },
        $set: { lastTriggeredAt: new Date() },
      });

      console.log(`Comment reply: ${commentSuccess ? "OK" : "FAILED"}`);
      console.log(`Instagram DM:  ${dmSuccess ? "OK" : "FAILED (needs approval)"}`);
    }
  }

  return new Response("EVENT_RECEIVED", { status: 200 });
}

// ✅ Clean - no DB calls here
async function replyToComment(commentId: string, message: string): Promise<boolean> {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${commentId}/replies`,
      { message },
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );
    console.log("Comment reply sent");
    return true;
  } catch (err: any) {
    console.error("Comment reply failed:", err.response?.data ?? err.message);
    return false;
  }
}

// ✅ Clean - no DB calls here
async function sendInstagramDM(userId: string, message: string): Promise<boolean> {
  try {
    await axios.post(
      "https://graph.instagram.com/v21.0/me/messages",
      {
        recipient: { id: userId },
        message: { text: message },
        messaging_type: "RESPONSE",
      },
      { params: { access_token: INSTAGRAM_ACCESS_TOKEN } }
    );
    console.log("Instagram DM sent");
    return true;
  } catch (err: any) {
    console.error("Instagram DM failed:", err.response?.data ?? err.message);
    return false;
  }
}