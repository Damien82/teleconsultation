// Avant : const RendezVous = require("../models/RendezVous");
// ✅ Après en ES Modules
import RendezVous from "../models/RendezVous.js";
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;
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
    
    // SÉCURITÉ : Vérifier que le RDV est bien "validé" avant de démarrer
    if (rdv.statut !== "validé" && rdv.statut !== "en cours") {
      return res.status(400).json({ message: "Le rendez-vous doit être validé pour démarrer." });
    }

    // 1. Mise à jour du statut et du roomId
    rdv.statut = "en cours";
    if (!rdv.roomId) {
      rdv.roomId = `consult-${rdv._id}`;
    }
    await rdv.save();

    // 2. Génération du Token Agora pour le Médecin
    const APP_ID = process.env.AGORA_APP_ID;
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
    
    const expirationTimeInSeconds = 3600; 
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

    // On génère le token immédiatement pour que le médecin puisse se connecter
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      rdv.roomId, // Le channel est le roomId
      0, 
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    res.json({
      message: "Consultation démarrée",
      roomId: rdv.roomId,
      agoraConfig: {
        appId: APP_ID,
        token: token,
        channel: rdv.roomId
      },
      rdv
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
