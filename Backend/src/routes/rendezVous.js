const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  prendreRDV,
  validerRDV,
  terminerConsultation,
  getRDVsMedecin,
  getRDVsPatient
} = require("../controllers/rendezVousController");

router.use(protect);

// Patient
router.post("/prendre", restrictTo("patient"), prendreRDV);
router.get("/mes", restrictTo("patient"), getRDVsPatient);

// Medecin
router.get("/medecin", restrictTo("medecin"), getRDVsMedecin);
router.put("/valider/:id", restrictTo("medecin"), validerRDV);
router.put("/terminer/:id", restrictTo("medecin"), terminerConsultation);

module.exports = router;
