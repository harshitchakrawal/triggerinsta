import axios from "axios";
import { prisma } from "@/app/lib/prisma";

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
  console.log("Webhook received:", JSON.stringify(body, null, 2));

  if (body.object !== "instagram") {
    return new Response("EVENT_RECEIVED", { status: 200 });
  }

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
      const rule = await prisma.automationRule.findFirst({ where: { mediaId, isActive: true } });
      if (!rule) continue;
      console.log("testing")

      // Step 2 - keyword check
      if (!commentText.includes(rule.keyword.toLowerCase())) continue;

      // Step 3 - dedup check
      const dedupKey = `${commenterId}:${mediaId}`;
      const already = await prisma.processedComment.findUnique({ where: { dedupKey } });
      if (already) continue;

      // Step 4 - send comment reply
      const commentSuccess = await replyToComment(commentId, rule.replyToComment);

      // Step 5 - send DM
      const dmSuccess = await sendInstagramDM(commenterId, rule.replyToDM);

      // Step 6 - fetch username and save dedup + update stats
      
      let actualUsername = comment.from?.username || comment.from?.name || "unknown";

      try {
        if (actualUsername === "unknown") {
          const res = await axios.get(`https://graph.facebook.com/v19.0/${commentId}?fields=from{username}`, {
            params: { access_token: PAGE_ACCESS_TOKEN },
          });
          if (res.data?.from?.username) {
            actualUsername = res.data.from.username;
          } else {
            actualUsername = commenterId;
          }
        }

        await prisma.processedComment.create({
          data: { dedupKey, ruleId: rule.id, username: actualUsername, commentText },
        });
      } catch (err: any) {
        if (err.code === "P2002") {
          console.log("Duplicate dedupKey, skipping stats update");
          continue;
        }
        throw err;
      }

      await prisma.automationRule.update({
        where: { id: rule.id },
        data: {
          triggers: { increment: 1 },
          repliesSent: { increment: commentSuccess || dmSuccess ? 1 : 0 },
          lastTriggeredAt: new Date(),
        },
      });

      console.log(`Comment reply: ${commentSuccess ? "OK" : "FAILED"}`);
      console.log(`Instagram DM:  ${dmSuccess ? "OK" : "FAILED (needs approval)"}`);
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
    return true;
  } catch (err: any) {
    console.error("Comment reply failed:", err.response?.data ?? err.message);
    return false;
  }
}

async function sendInstagramDM(userId: string, message: string): Promise<boolean> {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PAGE_ID}/messages`,
      { recipient: { id: userId }, message: { text: message }, messaging_type: "RESPONSE" },
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );
    return true;
  } catch (err: any) {
    console.error("Instagram DM failed:", err.response?.data ?? err.message);
    return false;
  }
}
