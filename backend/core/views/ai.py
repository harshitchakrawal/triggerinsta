"""Port of /api/ai/suggestions — Groq-powered content recommendation."""

import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import AutomationRule, User
from core.services import graph_api, groq

logger = logging.getLogger(__name__)


@api_view(["POST"])
def suggestions(request):
    try:
        email = getattr(request.user, "email", None)
        user = User.objects.filter(email=email).first() if email else None
        if user is None:
            return Response({"error": "Not authenticated"}, status=401)
        if not user.instagram_connected:
            return Response({"error": "Instagram not connected"}, status=400)

        try:
            media = graph_api.fetch_user_media(user.instagram_account_id, user.instagram_access_token)
        except graph_api.GraphAPIError:
            media = []

        rules = list(AutomationRule.objects.order_by("-triggers")[:10])

        top_posts = [
            {
                "caption": p.get("caption") or "No caption",
                "likes": p.get("like_count") or 0,
                "comments": p.get("comments_count") or 0,
                "type": p.get("media_type"),
            }
            for p in media[:5]
        ]
        top_automations = [
            {
                "keyword": r.keyword,
                "triggers": r.triggers,
                "successRate": round((r.replies_sent / r.triggers) * 100) if r.triggers else 0,
            }
            for r in rules[:3]
        ]

        try:
            result = groq.generate_suggestion(top_posts, top_automations)
        except RuntimeError as err:
            logger.error("Groq API error: %s", err)
            return Response({"error": "AI service unavailable"}, status=502)

        return Response({"success": True, **result})
    except Exception as err:  # noqa: BLE001
        logger.error("[AI suggestions] %s", err)
        return Response({"error": str(err) or "Internal error"}, status=500)
