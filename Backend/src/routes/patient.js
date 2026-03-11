// src/routes/patient.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { role } from "../middleware/roleMiddleware.js";
import * as patientController from "../controllers/patientController.js";

const router = express.Router();

// Appliquer auth + rôle patient
router.use(protect, role("patient"));

// Routes patient
router.post("/rdv", patientController.prendreRDV);
router.get("/rdvs", patientController.getMesRDV);
router.get("/stats", patientController.getStatsPatient);
router.get("/stats", patientController.getStatsPatientgraph);
router.delete("/rdvs/:id", patientController.annulerRDV);

export default router;
