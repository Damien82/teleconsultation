import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {role} from "../middleware/roleMiddleware.js";
import * as medecin from "../controllers/medecinController.js";

const router = express.Router();

router.use(protect, role("medecin"));

router.get("/rdvs", medecin.getMesRDV);
router.put("/rdv/:id/valider", medecin.validerRDV);
router.put("/rdv/:id/start", medecin.demarrerConsultation);
router.get("/stats", medecin.getStatsMedecin);

export default router; // ✅ export par défaut compatible import
