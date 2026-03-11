import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiTerminerConsultation } from "../services/api";
import socket from "../services/socket";

type Props = {
  rdvId: string;
  onClose: () => void;
  removeRDVFromList?: (rdvId: string) => void; // pour médecin
  removeRDVFromPatientList?: (rdvId: string) => void; // pour patient
};

export default function ConsultationModal({ rdvId, onClose, removeRDVFromList, removeRDVFromPatientList }: Props) {
  const { user } = useAuth();
  const [compteRendu, setCompteRendu] = useState("");
  const [ordonnance, setOrdonnance] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!user) return alert("Utilisateur non connecté");
    if (!compteRendu.trim()) return alert("Veuillez remplir le compte rendu");

    try {
      setLoading(true);

      // API : terminer consultation
      await apiTerminerConsultation(rdvId, { compteRendu, ordonnance }, user.token);

      // Retirer le RDV du médecin
      if (removeRDVFromList) removeRDVFromList(rdvId);

      // Notifier le patient
      if (removeRDVFromPatientList) removeRDVFromPatientList(rdvId);
      else socket.emit("rdv-termine", { rdvId });

      alert("Consultation terminée !");
      onClose();
    } catch (err) {
      console.error("Erreur terminer consultation :", err);
      alert("Erreur lors de la sauvegarde !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] h-[50%] rounded-xl flex flex-col p-4">
        <h2 className="text-lg font-bold mb-2">Terminer la consultation</h2>

        <textarea
          className="border p-2 rounded mb-2 flex-1 resize-none"
          placeholder="Écrire le compte rendu..."
          value={compteRendu}
          onChange={(e) => setCompteRendu(e.target.value)}
        />

        <textarea
          className="border p-2 rounded mb-2 flex-1 resize-none"
          placeholder="Écrire l'ordonnance..."
          value={ordonnance}
          onChange={(e) => setOrdonnance(e.target.value)}
        />

        <div className="flex gap-2 mt-2">
          <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            onClick={handleFinish}
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Terminer"}
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            onClick={onClose}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
