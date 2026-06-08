"""Internal user upsert — called by NextAuth callbacks (Google sign-in /
Instagram credentials) so the frontend never touches the DB directly."""

import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import User

logger = logging.getLogger(__name__)


@api_view(["POST"])
def upsert_user(request):
    data = request.data or {}
    email = data.get("email")
    if not email:
        return Response({"error": "email required"}, status=400)

    try:
        user, _ = User.objects.get_or_create(
            email=email,
            defaults={"name": data.get("name"), "image": data.get("image")},
        )
    except Exception as err:  # noqa: BLE001
        logger.error("[internal upsert_user] %s", err)
        return Response({"error": "upsert failed"}, status=500)

    return Response({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "image": user.image,
    })
