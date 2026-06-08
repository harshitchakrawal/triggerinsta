-- DropForeignKey
ALTER TABLE "ProcessedComment" DROP CONSTRAINT "ProcessedComment_ruleId_fkey";

-- AddForeignKey
ALTER TABLE "ProcessedComment" ADD CONSTRAINT "ProcessedComment_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "AutomationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
