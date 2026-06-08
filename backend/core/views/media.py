"""Port of /api/media/verify — resolve a pasted Instagram URL to a media id."""

import re

from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.services import graph_api

SHORTCODE_RE = re.compile(r"instagram\.com/(?:reel|p|tv)/([A-Za-z0-9_-]+)")


@api_view(["POST"])
def verify(request):
    url = (request.data or {}).get("url")
    if not url:
        return Response({"success": False, "error": "Missing required field: url"}, status=400)

    match = SHORTCODE_RE.search(url)
    if not match:
        return Response({"success": False, "error": "Invalid Instagram URL format"}, status=400)
    shortcode = match.group(1)

    account_id = settings.INSTAGRAM_ACCOUNT_ID
    token = settings.PAGE_ACCESS_TOKEN
    if not account_id or not token:
        return Response(
            {"success": False, "error": "Instagram credentials not configured"}, status=500
        )

    try:
        media_list = graph_api.fetch_media_for_verify(account_id, token)
    except graph_api.GraphAPIError as err:
        return Response({"success": False, "error": f"Instagram API error: {err}"}, status=502)

    found = next((m for m in media_list if m.get("shortcode") == shortcode), None)
    if not found:
        return Response(
            {"success": False, "error": "Media not found in account", "shortcode": shortcode},
            status=404,
        )

    return Response({
        "success": True,
        "mediaId": found.get("id"),
        "shortcode": found.get("shortcode"),
        "permalink": found.get("permalink"),
        "caption": found.get("caption") or "",
    })
