import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  instagram: {
    isConnected: { type: Boolean, default: false },
    accessToken: { type: String, required: false },
    accountId: { type: String, required: false },
    username: { type: String, required: false },
    accountType: { type: String, required: false },
    connectedAt: { type: Date, required: false },
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
