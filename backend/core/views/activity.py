"""Port of /api/activity — searchable/filterable paginated log + CSV export."""

import logging

from django.db.models import Q
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import ProcessedComment
from core.utils import time_ago

logger = logging.getLogger(__name__)

LIMIT = 20


@api_view(["GET"])
def activity(request):
    try:
        page = int(request.query_params.get("page", "1"))
        search = request.query_params.get("search", "")
        flt = request.query_params.get("filter", "all")
        as_csv = request.query_params.get("csv") == "true"

        qs = ProcessedComment.objects.select_related("rule")
        if search:
            qs = qs.filter(
                Q(username__icontains=search) | Q(comment_text__icontains=search)
            )
        qs = qs.order_by("-created_at")

        rows = list(qs)
        if flt == "replied":
            rows = [a for a in rows if a.rule and a.rule.is_active]
        elif flt == "skipped":
            rows = [a for a in rows if not (a.rule and a.rule.is_active)]

        if as_csv:
            return _csv(rows)

        total = len(rows)
        paginated = rows[(page - 1) * LIMIT : page * LIMIT]
        activities = [
            {
                "id": a.id,
                "username": a.username or "unknown",
                "commentText": a.comment_text or "",
                "reel": (a.rule.caption or a.rule.reel_url or a.rule.media_id)
                if a.rule
                else "Unknown reel",
                "keyword": a.rule.keyword if a.rule else "",
                "status": "replied" if (a.rule and a.rule.is_active) else "skipped",
                "timeAgo": time_ago(a.created_at),
                "date": a.created_at.strftime("%b %-d, %-I:%M %p"),
            }
            for a in paginated
        ]
        total_pages = (total + LIMIT - 1) // LIMIT
        return Response({"activities": activities, "total": total, "page": page, "totalPages": total_pages})
    except Exception as err:  # noqa: BLE001
        logger.error("[GET /api/activity] %s", err)
        return Response({"error": "Internal server error"}, status=500)


def _csv(rows) -> HttpResponse:
    lines = ["Username,Comment,Reel,Keyword,Status,Date"]
    for a in rows:
        comment = (a.comment_text or "").replace('"', "'")
        reel = ((a.rule.caption or a.rule.media_id) if a.rule else "").replace('"', "'")
        keyword = a.rule.keyword if a.rule else ""
        status = "Reply sent" if (a.rule and a.rule.is_active) else "Skipped (paused)"
        lines.append(
            f'@{a.username or "unknown"},"{comment}","{reel}",{keyword},{status},'
            f"{a.created_at.isoformat()}"
        )
    resp = HttpResponse("\n".join(lines), content_type="text/csv")
    resp["Content-Disposition"] = "attachment; filename=activity-log.csv"
    return resp
