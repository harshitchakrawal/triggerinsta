"""Port of /api/analytics — 7-day trend, per-reel breakdown, top commenters."""

import logging
from datetime import timedelta

from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import AutomationRule, ProcessedComment
from core.utils import start_of_today

logger = logging.getLogger(__name__)


@api_view(["GET"])
def analytics(request):
    try:
        days = []
        today_start = start_of_today()
        for i in range(6, -1, -1):
            start = today_start - timedelta(days=i)
            end = start + timedelta(hours=23, minutes=59, seconds=59, microseconds=999000)
            count = ProcessedComment.objects.filter(created_at__gte=start, created_at__lte=end).count()
            days.append({"date": start.strftime("%b %-d"), "count": count})

        rules = list(AutomationRule.objects.all())
        reel_breakdown = sorted(
            (
                {
                    "mediaId": r.media_id,
                    "caption": r.caption or r.reel_url or r.media_id,
                    "keyword": r.keyword,
                    "triggers": r.triggers,
                    "repliesSent": r.replies_sent,
                    "isActive": r.is_active,
                    "successRate": round((r.replies_sent / r.triggers) * 100) if r.triggers else 0,
                }
                for r in rules
            ),
            key=lambda x: x["triggers"],
            reverse=True,
        )

        top_commenters_raw = (
            ProcessedComment.objects.exclude(username__in=["unknown", "unknown_user"])
            .values("username")
            .annotate(count=Count("username"))
            .order_by("-count")[:5]
        )
        top_commenters = [
            {"username": c["username"] or "unknown", "count": c["count"]}
            for c in top_commenters_raw
        ]

        total_triggers = sum(r.triggers for r in rules)
        total_replies = sum(r.replies_sent for r in rules)

        return Response({
            "days": days,
            "reelBreakdown": reel_breakdown,
            "topCommenters": top_commenters,
            "totalTriggers": total_triggers,
            "totalReplies": total_replies,
            "totalRules": len(rules),
            "activeRules": sum(1 for r in rules if r.is_active),
            "successRate": round((total_replies / total_triggers) * 100) if total_triggers else 0,
        })
    except Exception as err:  # noqa: BLE001
        logger.error("[GET /api/analytics] %s", err)
        return Response({"error": "Internal server error"}, status=500)
