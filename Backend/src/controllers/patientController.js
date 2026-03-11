import RendezVous from "../models/RendezVous.js"; // note le .js final
import Consultation from "../models/Consultation.js";

// Prendre RDV (paiement simulé)
export const prendreRDV = async (req, res) => {
  const { medecinId, date } = req.body;

  const rdv = await RendezVous.create({
    patientId: req.user.id,
    medecinId,
    date,
    statut: "payé", // paiement simulé
  });

  res.json(rdv);
};

// Voir ses RDV
export const getMesRDV = async (req, res) => {
  const rdvs = await RendezVous.find({
    patientId: req.user.id,
  }).populate("medecinId");

  res.json(rdvs);
};

// Stats patient
export const getStatsPatient = async (req, res) => {
  const rdvsPayes = await RendezVous.countDocuments({
    patientId: req.user.id,
    statut: "payé",
  });

  const consultations = await Consultation.countDocuments({
    patientId: req.user.id,
  });

  res.json({ rdvsPayes, consultations });
};


export const annulerRDV = async (req, res) => {
  try {
    const rdvId = req.params.id;
    const patientId = req.user._id; // depuis authMiddleware

    // Chercher le RDV
    const rdv = await RendezVous.findById(rdvId);
    if (!rdv) return res.status(404).json({ message: "RDV non trouvé" });

    // Vérifier que le RDV appartient bien au patient
    if (rdv.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Supprimer le RDV
    await RendezVous.findByIdAndDelete(rdvId);

    res.json({ message: "RDV annulé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// controllers/patientController.js
export const getStatsPatientgraph = async (req, res) => {
  try {
    const patientId = req.user._id;

    const rdvsPayes = await RDV.countDocuments({ patientId, statut: "payé" });
    const consultations = await RDV.countDocuments({ patientId, statut: "consulté" });

    // Historique par mois
    const rawHistory = await RDV.aggregate([
      { $match: { patientId } },
      {
        $group: {
          _id: { $month: "$date" },
          rdvs: { $sum: { $cond: [{ $eq: ["$statut", "payé"] }, 1, 0] } },
          consultations: { $sum: { $cond: [{ $eq: ["$statut", "consulté"] }, 1, 0] } },
        }
      }
    ]);

    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const history = Array(12).fill(0).map((_, i) => {
      const monthData = rawHistory.find(r => r._id === i + 1);
      return {
        month: monthNames[i],
        rdvs: monthData?.rdvs || 0,
        consultations: monthData?.consultations || 0
      };
    });

    res.json({ rdvsPayes, consultations, history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
