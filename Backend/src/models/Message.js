
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  rdvId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["patient", "medecin"], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
