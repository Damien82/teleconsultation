// src/models/RendezVous.js
import mongoose from "mongoose";

const rendezVousSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medecinId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  statut: { type: String, enum: ["payé", "validé", "consulté", "annulé", "en cours"], default: "payé" },
  roomId: { type: String }, // <-- champ ajouté pour stocker le lien de la room
}, { timestamps: true });

export default mongoose.model("RendezVous", rendezVousSchema);