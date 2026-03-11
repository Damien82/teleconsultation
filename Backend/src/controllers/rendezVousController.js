const RendezVous = require("../models/RendezVous");
const Consultation = require("../models/Consultation");
const generatePDF = require("../utils/generateOrdonnancePDF");
const path = require("path");

// Patient prend un RDV (paiement simulé)
exports.prendreRDV = async (req, res) => {
  const { medecinId, date } = req.body;
  const rdv = await RendezVous.create({
    patientId: req.user._id,
    medecinId,
    date,
    statut: "payé" // faux paiement simulé
  });
  res.status(201).json(rdv);
};

// Medecin valide le RDV pour consultation
exports.validerRDV = async (req, res) => {
  const rdv = await RendezVous.findById(req.params.id);
  if(!rdv) return res.status(404).json({ message: "RDV introuvable" });
  rdv.statut = "validé";
  await rdv.save();
  res.json(rdv);
};

// Création compte-rendu + ordonnance après consultation
exports.terminerConsultation = async (req, res) => {
  const { compteRendu, ordonnance } = req.body;
  const rdv = await RendezVous.findById(req.params.id);
  if(!rdv) return res.status(404).json({ message: "RDV introuvable" });

  rdv.statut = "consulté";
  await rdv.save();

  const consultation = await Consultation.create({
    patientId: rdv.patientId,
    medecinId: rdv.medecinId,
    compteRendu,
    ordonnance
  });

  res.json(consultation);
};

// Liste RDV pour medecin
exports.getRDVsMedecin = async (req, res) => {
  const rdvs = await RendezVous.find({ medecinId: req.user._id }).populate("patientId","name email");
  res.json(rdvs);
};

// Liste RDV pour patient
exports.getRDVsPatient = async (req, res) => {
  const rdvs = await RendezVous.find({ patientId: req.user._id }).populate("medecinId","name email");
  res.json(rdvs);
};


exports.terminerConsultation = async (req, res) => {
  const { compteRendu, ordonnance } = req.body;
  const rdv = await RendezVous.findById(req.params.id)
    .populate("patientId")
    .populate("medecinId");

  if (!rdv) return res.status(404).json({ message: "RDV introuvable" });

  const consultation = await Consultation.create({
    patientId: rdv.patientId._id,
    medecinId: rdv.medecinId._id,
    compteRendu,
    ordonnance,
  });

  const pdfPath = generatePDF({
    patientName: rdv.patientId.name,
    medecinName: rdv.medecinId.name,
    date: new Date().toLocaleDateString(),
    compteRendu,
    ordonnance,
    consultationId: consultation._id,
  });

  consultation.pdfUrl = pdfPath;
  await consultation.save();

  rdv.statut = "consulté";
  await rdv.save();

  res.json({ message: "Consultation terminée", pdfPath });
};