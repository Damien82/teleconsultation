import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { terminerConsultation, historiqueConsultations,historiqueConsultationsPatient } from "../controllers/consultationController.js";

const router = express.Router();

// Terminer une consultation (mettre statut à "terminé")
router.put("/terminer/:rdvId", protect, terminerConsultation);

// Historique
router.get("/historique", protect, historiqueConsultations);

router.get("/historique/patient", protect, historiqueConsultationsPatient);

export default router;
