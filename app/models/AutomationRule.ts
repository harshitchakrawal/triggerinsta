// models/AutomationRule.ts
import mongoose from "mongoose";

const AutomationRuleSchema = new mongoose.Schema({
  mediaId: { type: String, required: true, unique: true },
  reelUrl: { type: String, required: false },
  thumbnailUrl: { type: String, required: false },
  caption: { type: String, required: false },
  keyword: { type: String, required: true },
  replyToComment: { type: String, required: true },
  replyToDM: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  triggers: { type: Number, default: 0 },
  repliesSent: { type: Number, default: 0 },
  lastTriggeredAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const AutomationRule = mongoose.models.AutomationRule ||
  mongoose.model("AutomationRule", AutomationRuleSchema);