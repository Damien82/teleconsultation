import mongoose from "mongoose";

const rendezVousSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medecinId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  statut: { type: String, enum: ["payé","validé","consulté","annulé"], default: "payé" },
}, { timestamps: true });

export default mongoose.model("RendezVous", rendezVousSchema); // <-- export par défaut
