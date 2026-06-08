"""Shared helpers ported from the Next.js routes."""

from django.utils import timezone


def time_ago(dt) -> str:
    seconds = int((timezone.now() - dt).total_seconds())
    if seconds < 60:
        return f"{seconds}s ago"
    if seconds < 3600:
        return f"{seconds // 60}m ago"
    if seconds < 86400:
        return f"{seconds // 3600}h ago"
    if seconds < 2592000:
        return f"{seconds // 86400}d ago"
    return f"{seconds // 2592000}mo ago"


def start_of_today():
    return timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
