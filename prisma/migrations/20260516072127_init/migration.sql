-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instagramConnected" BOOLEAN NOT NULL DEFAULT false,
    "instagramAccessToken" TEXT,
    "instagramAccountId" TEXT,
    "instagramUsername" TEXT,
    "instagramAccountType" TEXT,
    "instagramConnectedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationRule" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "reelUrl" TEXT,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "keyword" TEXT NOT NULL,
    "replyToComment" TEXT NOT NULL,
    "replyToDM" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "triggers" INTEGER NOT NULL DEFAULT 0,
    "repliesSent" INTEGER NOT NULL DEFAULT 0,
    "lastTriggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessedComment" (
    "id" TEXT NOT NULL,
    "dedupKey" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "username" TEXT DEFAULT 'unknown_user',
    "commentText" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationRule_mediaId_key" ON "AutomationRule"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedComment_dedupKey_key" ON "ProcessedComment"("dedupKey");

-- AddForeignKey
ALTER TABLE "ProcessedComment" ADD CONSTRAINT "ProcessedComment_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "AutomationRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
