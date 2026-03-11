import Consultation from "../models/Consultation.js";
import RendezVous from "../models/RendezVous.js";


export const terminerConsultation = async (req, res) => {
  const { rdvId } = req.params;
  const { compteRendu, ordonnance } = req.body;

  try {
    // 1️⃣ Récupérer le RDV
    const rdv = await RendezVous.findById(rdvId);
    if (!rdv) return res.status(404).json({ message: "Rendez-vous introuvable" });

    // 2️⃣ Créer la consultation
    const consultation = await Consultation.create({
      patientId: rdv.patientId,
      medecinId: rdv.medecinId,
      date: new Date(),
      compteRendu: compteRendu || "",
      ordonnance: ordonnance || "",
    });

    // 3️⃣ Supprimer le rendez-vous (optionnel, ou mettre statut = consulté)
    await RendezVous.findByIdAndDelete(rdvId);

    res.json({ message: "Consultation terminée", consultation });
  } catch (err) {
    console.error("Erreur serveur terminerConsultation:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const historiqueConsultations = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const filter =
      role === "medecin"
        ? { medecinId: userId }
        : { patientId: userId };

    const consultations = await Consultation.find(filter)
      .populate("patientId", "name")
      .populate("medecinId", "name")
      .sort({ createdAt: -1 });

    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const historiqueConsultationsPatient = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const patientId = req.user._id; // idem que medecin, mais patient
    const consultations = await Consultation.find({ patientId })
      .populate("medecinId", "name")
      .populate("patientId", "name")
      .sort({ createdAt: -1 });

    res.json(consultations);
  } catch (err) {
    console.error("Erreur historique patient:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};