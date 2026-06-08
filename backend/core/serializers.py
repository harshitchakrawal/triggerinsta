"""Hand-built serializers producing the camelCase shapes the Next.js frontend
already expects (the original API returned Prisma objects verbatim)."""


def iso(dt):
    return dt.isoformat() if dt else None


def serialize_rule(r) -> dict:
    return {
        "id": r.id,
        "mediaId": r.media_id,
        "reelUrl": r.reel_url,
        "thumbnailUrl": r.thumbnail_url,
        "caption": r.caption,
        "keyword": r.keyword,
        "replyToComment": r.reply_to_comment,
        "replyToDM": r.reply_to_dm,
        "isActive": r.is_active,
        "triggers": r.triggers,
        "repliesSent": r.replies_sent,
        "lastTriggeredAt": iso(r.last_triggered_at),
        "createdAt": iso(r.created_at),
    }
