"""Port of /api/proxy-image — public, returns image bytes.

Instagram thumbnail URLs expire, so given a mediaId we re-fetch a fresh URL from
the Graph API; otherwise we fall back to a passed-through url.
"""

import logging

import requests
from django.conf import settings
from django.http import HttpResponse, JsonResponse

from core.services import graph_api

logger = logging.getLogger(__name__)


def proxy_image(request):
    media_id = request.GET.get("mediaId")
    fallback_url = request.GET.get("url")

    image_url = None
    if media_id and settings.PAGE_ACCESS_TOKEN:
        image_url = graph_api.fetch_fresh_thumbnail_url(media_id, settings.PAGE_ACCESS_TOKEN)
    elif fallback_url:
        image_url = fallback_url

    if not image_url:
        return JsonResponse({"error": "Could not resolve image URL"}, status=400)

    try:
        upstream = requests.get(
            image_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            timeout=30,
        )
    except requests.RequestException as err:
        logger.error("[proxy-image] %s", err)
        return JsonResponse({"error": "Internal server error"}, status=500)

    if not upstream.ok:
        return JsonResponse({"error": "Failed to fetch image"}, status=upstream.status_code)

    resp = HttpResponse(
        upstream.content,
        content_type=upstream.headers.get("content-type", "image/jpeg"),
    )
    resp["Cache-Control"] = "public, max-age=3600"
    return resp
