"""Port of /api/auth/instagram/callback's heavy lifting.

The Next.js callback route still owns the browser redirect + NextAuth session
handshake; it forwards {code, state} here. We do the Graph API token exchange,
resolve the Instagram business account, persist to the User table, and return
the resolved identity so Next can finish the redirect.
"""

import logging

import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import User

logger = logging.getLogger(__name__)

GRAPH = "https://graph.facebook.com/v18.0"
TIMEOUT = 30


@api_view(["POST"])
def exchange(request):
    code = (request.data or {}).get("code")
    state = (request.data or {}).get("state")
    if not code or not state:
        return Response({"error": "invalid_request"}, status=400)

    app_id = settings.FACEBOOK_APP_ID
    app_secret = settings.FACEBOOK_APP_SECRET
    redirect_uri = settings.INSTAGRAM_REDIRECT_URI
    if not (app_id and app_secret and redirect_uri):
        return Response({"error": "Instagram OAuth credentials not configured"}, status=500)

    try:
        # Step 1 — code → short-lived token
        token_resp = requests.post(
            f"{GRAPH}/oauth/access_token",
            data={
                "client_id": app_id,
                "client_secret": app_secret,
                "redirect_uri": redirect_uri,
                "code": code,
            },
            timeout=TIMEOUT,
        )
        token_data = token_resp.json()
        if not token_resp.ok or token_data.get("error"):
            msg = (token_data.get("error") or {}).get("message", "Unknown error")
            return Response({"error": f"Token exchange failed: {msg}"}, status=400)
        access_token = token_data["access_token"]

        # Step 2 — long-lived user token (page tokens derived from it are permanent)
        long_lived = requests.get(
            f"{GRAPH}/oauth/access_token",
            params={
                "grant_type": "fb_exchange_token",
                "client_id": app_id,
                "client_secret": app_secret,
                "fb_exchange_token": access_token,
            },
            timeout=TIMEOUT,
        ).json()
        long_lived_token = long_lived.get("access_token") or access_token

        # Step 3 — Facebook user info
        me = requests.get(
            f"{GRAPH}/me",
            params={"fields": "id,name,email,picture", "access_token": long_lived_token},
            timeout=TIMEOUT,
        ).json()

        # Step 4 — pages → page token → Instagram business account
        pages = requests.get(
            f"{GRAPH}/me/accounts",
            params={"access_token": long_lived_token},
            timeout=TIMEOUT,
        ).json()

        instagram_account_id = None
        page_access_token = access_token
        instagram_username = None

        page_list = pages.get("data") or []
        if page_list:
            page = page_list[0]
            page_token_res = requests.get(
                f"{GRAPH}/{page['id']}",
                params={"fields": "access_token", "access_token": long_lived_token},
                timeout=TIMEOUT,
            ).json()
            page_access_token = page_token_res.get("access_token") or page.get("access_token")

            ig = requests.get(
                f"{GRAPH}/{page['id']}",
                params={"fields": "instagram_business_account", "access_token": page_access_token},
                timeout=TIMEOUT,
            ).json()
            if ig.get("instagram_business_account"):
                instagram_account_id = ig["instagram_business_account"]["id"]
                acct = requests.get(
                    f"{GRAPH}/{instagram_account_id}",
                    params={"fields": "id,username", "access_token": page_access_token},
                    timeout=TIMEOUT,
                ).json()
                instagram_username = acct.get("username")

        is_login_flow = state == "login"
        user_email = me.get("email") or f"fb_{me.get('id')}@triggerflow.app"
        user_name = me.get("name") or instagram_username or "Instagram User"
        user_image = ((me.get("picture") or {}).get("data") or {}).get("url")

        lookup_email = user_email if is_login_flow else state

        ig_fields = {}
        if instagram_account_id:
            ig_fields = {
                "instagram_connected": True,
                "instagram_access_token": page_access_token,
                "instagram_account_id": instagram_account_id,
                "instagram_username": instagram_username or "unknown",
                "instagram_account_type": "BUSINESS",
                "instagram_connected_at": _now(),
            }

        user, created = User.objects.get_or_create(
            email=lookup_email,
            defaults={"name": user_name, "image": user_image, **ig_fields},
        )
        if not created and ig_fields:
            for k, v in ig_fields.items():
                setattr(user, k, v)
            user.save()

        return Response({
            "isLoginFlow": is_login_flow,
            "email": user_email,
            "name": user_name,
            "image": user_image or "",
            "connected": bool(instagram_account_id),
            "username": instagram_username,
        })
    except Exception as err:  # noqa: BLE001
        logger.error("Instagram OAuth exchange error: %s", err)
        return Response({"error": str(err)}, status=500)


def _now():
    from django.utils import timezone

    return timezone.now()
