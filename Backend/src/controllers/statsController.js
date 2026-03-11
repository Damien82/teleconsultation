const User = require("../models/User");
const RendezVous = require("../models/RendezVous");
const Consultation = require("../models/Consultation");

exports.getStatsAdmin = async (req,res)=>{
  const patients = await User.countDocuments({role:"patient"});
  const medecins = await User.countDocuments({role:"medecin"});
  const rdvs = await RendezVous.countDocuments();
  res.json({patients, medecins, rdvs});
};

exports.getStatsMedecin = async (req,res)=>{
  const rdvsValides = await RendezVous.countDocuments({medecinId:req.user._id, statut:"validé"});
  const consultations = await Consultation.countDocuments({medecinId:req.user._id});
  res.json({rdvsValides, consultations});
};

exports.getStatsPatient = async (req,res)=>{
  const rdvsPayes = await RendezVous.countDocuments({patientId:req.user._id, statut:"payé"});
  const consultations = await Consultation.countDocuments({patientId:req.user._id});
  res.json({rdvsPayes, consultations});
};
