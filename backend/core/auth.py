"""Internal-only authentication.

The Next.js frontend owns user auth (NextAuth). It proxies API calls to this
backend server-side, attaching:
  - X-Internal-Secret : shared secret, proves the call came from our frontend
  - X-User-Email      : the authenticated user's email (identity for scoping)

Browsers never call this backend directly, so a shared secret is sufficient.
"""

from django.conf import settings
from rest_framework import authentication, exceptions, permissions


class InternalUser:
    """Lightweight principal — we don't use django.contrib.auth."""

    is_authenticated = True
    is_anonymous = False

    def __init__(self, email: str | None):
        self.email = email

    def __str__(self):
        return self.email or "internal"


class InternalSecretAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        secret = request.META.get("HTTP_X_INTERNAL_SECRET")
        if not secret:
            # No credentials presented — let the permission layer decide.
            return None
        expected = settings.INTERNAL_API_SECRET
        if not expected or secret != expected:
            raise exceptions.AuthenticationFailed("Invalid internal secret")
        email = request.META.get("HTTP_X_USER_EMAIL") or None
        return (InternalUser(email), None)


class IsInternalRequest(permissions.BasePermission):
    message = "Internal authentication required"

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and getattr(user, "is_authenticated", False))
