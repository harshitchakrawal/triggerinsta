"""Port of /api/dashboard — headline stats + recent activity."""

import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import AutomationRule, ProcessedComment
from core.serializers import serialize_rule
from core.utils import start_of_today, time_ago

logger = logging.getLogger(__name__)


@api_view(["GET"])
def dashboard(request):
    try:
        active_count = AutomationRule.objects.filter(is_active=True).count()
        triggers_today = ProcessedComment.objects.filter(created_at__gte=start_of_today()).count()

        all_rules = list(AutomationRule.objects.all())
        total_replies = sum(r.replies_sent for r in all_rules)
        total_triggers = sum(r.triggers for r in all_rules)

        active_rules = sorted(
            (r for r in all_rules if r.is_active),
            key=lambda r: r.triggers,
            reverse=True,
        )
        top_active_reels = [serialize_rule(r) for r in active_rules[:3]]
        success_rate = round((total_replies / total_triggers) * 100) if total_triggers else 0

        recent_raw = (
            ProcessedComment.objects.select_related("rule").order_by("-created_at")[:5]
        )
        recent_activity = []
        for a in recent_raw:
            uname = a.username
            if not uname or uname in ("unknown_user", "unknown"):
                uname = a.dedup_key.split(":")[0] if a.dedup_key else "unknown"
            keyword = a.rule.keyword if a.rule else "..."
            is_active = bool(a.rule and a.rule.is_active)
            recent_activity.append({
                "user": uname,
                "action": f"commented '{a.comment_text or keyword}'",
                "status": "reply sent" if is_active else "paused rule, skipped",
                "time": time_ago(a.created_at),
                "active": is_active,
            })

        return Response({
            "activeAutomationsCount": active_count,
            "triggersTodayCount": triggers_today,
            "totalReplies": total_replies,
            "totalTriggers": total_triggers,
            "topActiveReels": top_active_reels,
            "recentActivity": recent_activity,
            "successRate": success_rate,
        })
    except Exception as err:  # noqa: BLE001
        logger.error("Error fetching dashboard data: %s", err)
        return Response({"error": "Failed to fetch dashboard data"}, status=500)
