// Avant : const RendezVous = require("../models/RendezVous");
// ✅ Après en ES Modules
import RendezVous from "../models/RendezVous.js";
import { User } from "../models/User.js";
// si besoin pour stats ou autres

// Exemple de controller
export const getMesRDV = async (req, res) => {
  try {
    const rdvs = await RendezVous.find({ medecinId: req.user._id })
      .populate("patientId", "name email")
      .sort({ date: -1 });
    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validerRDV = async (req, res) => {
  try {
    const rdv = await RendezVous.findById(req.params.id);
    if (!rdv) return res.status(404).json({ message: "RDV non trouvé" });

    rdv.statut = "validé";
    await rdv.save();
    res.json(rdv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const demarrerConsultation = async (req, res) => {
  try {
    const rdv = await RendezVous.findById(req.params.id);
    if (!rdv) return res.status(404).json({ message: "RDV non trouvé" });

    // Changer le statut
    rdv.statut = "en cours";

    // Créer roomId si inexistant
    if (!rdv.roomId) {
      rdv.roomId = `consult-${rdv._id}`;
    }

    await rdv.save();

    res.json({
      message: "Consultation démarrée",
      roomId: rdv.roomId, // renvoyer le roomId au frontend
      rdv,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStatsMedecin = async (req, res) => {
  try {
    const rdvsValides = await RendezVous.countDocuments({
      medecinId: req.user._id,
      statut: "validé",
    });
    const consultations = await RendezVous.countDocuments({
      medecinId: req.user._id,
      statut: "consulté",
    });
    res.json({ rdvsValides, consultations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
