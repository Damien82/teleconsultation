import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medecinId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  compteRendu: { type: String },
  ordonnance: { type: String },
}, { timestamps: true });

const Consultation = mongoose.model("Consultation", consultationSchema);

// ✅ Export par défaut
export default Consultation;
