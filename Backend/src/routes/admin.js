import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { role } from "../middleware/roleMiddleware.js";
import {
  getPatients,
  deletePatient,
  getDoctors,
  createDoctor,
  deleteDoctor,
  getStatsAdmin
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/doctors", getDoctors);

// 🔐 ADMIN ONLY
router.use(protect, role("admin"));

// PATIENTS
router.get("/patients", getPatients);
router.delete("/patients/:id", deletePatient);

// MEDECINS

router.post("/doctors", createDoctor);
router.delete("/doctors/:id", deleteDoctor);

//STATS
router.get("/stats", getStatsAdmin);

export default router;
