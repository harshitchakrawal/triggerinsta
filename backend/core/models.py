"""Introspected models over the Prisma-owned Neon Postgres schema.

All models are `managed = False`: Django never creates, alters, or drops these
tables. Table names are quoted PascalCase and columns are camelCase (exactly as
Prisma created them — see ../frontend/prisma/migrations), so every field carries
an explicit `db_column`. New rows get a cuid `id` (no DB default exists).
"""

from django.db import models
from django.utils import timezone

from core.services.ids import generate_cuid


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=generate_cuid)
    name = models.TextField(null=True, blank=True)
    email = models.TextField(unique=True)
    image = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(db_column="createdAt", default=timezone.now)
    instagram_connected = models.BooleanField(db_column="instagramConnected", default=False)
    instagram_access_token = models.TextField(db_column="instagramAccessToken", null=True, blank=True)
    instagram_account_id = models.TextField(db_column="instagramAccountId", null=True, blank=True)
    instagram_username = models.TextField(db_column="instagramUsername", null=True, blank=True)
    instagram_account_type = models.TextField(db_column="instagramAccountType", null=True, blank=True)
    instagram_connected_at = models.DateTimeField(db_column="instagramConnectedAt", null=True, blank=True)

    class Meta:
        managed = False
        db_table = "User"


class AutomationRule(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=generate_cuid)
    media_id = models.TextField(db_column="mediaId", unique=True)
    reel_url = models.TextField(db_column="reelUrl", null=True, blank=True)
    thumbnail_url = models.TextField(db_column="thumbnailUrl", null=True, blank=True)
    caption = models.TextField(null=True, blank=True)
    keyword = models.TextField()
    reply_to_comment = models.TextField(db_column="replyToComment")
    reply_to_dm = models.TextField(db_column="replyToDM")
    is_active = models.BooleanField(db_column="isActive", default=True)
    triggers = models.IntegerField(default=0)
    replies_sent = models.IntegerField(db_column="repliesSent", default=0)
    last_triggered_at = models.DateTimeField(db_column="lastTriggeredAt", null=True, blank=True)
    created_at = models.DateTimeField(db_column="createdAt", default=timezone.now)

    class Meta:
        managed = False
        db_table = "AutomationRule"


class ProcessedComment(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=generate_cuid)
    dedup_key = models.TextField(db_column="dedupKey", unique=True)
    rule = models.ForeignKey(
        AutomationRule,
        on_delete=models.CASCADE,
        db_column="ruleId",
        related_name="processed_comments",
    )
    username = models.TextField(null=True, blank=True, default="unknown_user")
    comment_text = models.TextField(db_column="commentText", null=True, blank=True, default="")
    created_at = models.DateTimeField(db_column="createdAt", default=timezone.now)

    class Meta:
        managed = False
        db_table = "ProcessedComment"
