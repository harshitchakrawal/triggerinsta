"""Port of /api/rules (POST/GET/PATCH/PUT/DELETE)."""

import logging

from django.conf import settings
from django.db import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import AutomationRule
from core.serializers import serialize_rule
from core.services import graph_api

logger = logging.getLogger(__name__)


def _resolve_thumbnail(media_id: str):
    token = settings.PAGE_ACCESS_TOKEN
    if not token:
        return None
    try:
        details = graph_api.fetch_media_details(media_id, token)
        if details.get("media_type") == "VIDEO":
            return details.get("thumbnail_url")
        return details.get("media_url")
    except Exception as err:  # noqa: BLE001 — match the JS try/catch-and-continue
        logger.error("Instagram fetch failed: %s", err)
        return None


@api_view(["GET", "POST", "PATCH", "PUT", "DELETE"])
def rules(request):
    if request.method == "GET":
        return _get(request)
    if request.method == "POST":
        return _post(request)
    if request.method == "PATCH":
        return _patch(request)
    if request.method == "PUT":
        return _put(request)
    return _delete(request)


def _get(request):
    edit = request.query_params.get("edit")
    if edit:
        rule = AutomationRule.objects.filter(id=edit).first()
        if not rule:
            return Response({"error": "Not found"}, status=404)
        return Response({"rule": serialize_rule(rule)})
    rules_qs = AutomationRule.objects.order_by("-created_at")
    return Response({"rules": [serialize_rule(r) for r in rules_qs]})


def _post(request):
    data = request.data
    media_id = data.get("mediaId")
    keyword = data.get("keyword")
    reply_to_comment = data.get("replyToComment")
    reply_to_dm = data.get("replyToDm")

    if not (media_id and keyword and reply_to_comment and reply_to_dm):
        return Response({"error": "Missing required fields"}, status=400)

    try:
        rule = AutomationRule.objects.create(
            media_id=media_id,
            reel_url=data.get("reelUrl"),
            thumbnail_url=_resolve_thumbnail(media_id),
            caption=data.get("caption"),
            keyword=keyword,
            reply_to_comment=reply_to_comment,
            reply_to_dm=reply_to_dm,
        )
    except IntegrityError:
        return Response({"error": "Automation already exists for this mediaId"}, status=400)
    except Exception as err:  # noqa: BLE001
        logger.error("[POST /api/rules] %s", err)
        return Response({"error": str(err) or "Internal server error"}, status=500)

    return Response({"success": True, "rule": serialize_rule(rule)})


def _patch(request):
    rule = AutomationRule.objects.filter(id=request.data.get("id")).first()
    if not rule:
        return Response({"error": "Not found"}, status=404)
    rule.is_active = not rule.is_active
    rule.save(update_fields=["is_active"])
    return Response({"success": True, "rule": serialize_rule(rule)})


def _put(request):
    data = request.data
    rule = AutomationRule.objects.filter(id=data.get("id")).first()
    if not rule:
        return Response({"error": "Not found"}, status=404)

    rule.reel_url = data.get("reelUrl")
    rule.caption = data.get("caption")
    rule.keyword = data.get("keyword")
    rule.reply_to_comment = data.get("replyToComment")
    rule.reply_to_dm = data.get("replyToDm")

    media_id = data.get("mediaId")
    if media_id:
        rule.media_id = media_id
        thumb = _resolve_thumbnail(media_id)
        if thumb is not None:
            rule.thumbnail_url = thumb

    rule.save()
    return Response({"success": True, "rule": serialize_rule(rule)})


def _delete(request):
    AutomationRule.objects.filter(id=request.data.get("id")).delete()
    return Response({"success": True})
