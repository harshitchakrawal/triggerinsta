"""Root URL configuration. All API routes live under /api/ (the Next.js proxy
forwards /api/backend/<path> here as /api/<path>)."""

from django.urls import include, path

urlpatterns = [
    path("api/", include("core.urls")),
]
