// src/pages/patient/HistoriqueConsultation.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { apiGetHistoriqueConsultations } from "../../src/services/api";
import jsPDF from "jspdf";

interface Consultation {
  _id: string;
  patientId: { _id: string; name: string };
  medecinId: { _id: string; name: string };
  date: string;
  compteRendu: string;
  ordonnance: string;
}

export default function HistoriqueConsultation() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const loadConsultations = async () => {
    if (!user) return;
    try {
      const data = await apiGetHistoriqueConsultations(user.token);
      setConsultations(data);
    } catch (err) {
      console.error("Erreur récupération historique :", err);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [user]);

  const downloadPDF = (title: string, content: string) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 10, 20);
    doc.setFontSize(12);
    doc.text(content || "Aucun contenu", 10, 30, { maxWidth: 190 });
    doc.save(`${title}.pdf`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Historique des consultations</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-green-200 rounded">
          <thead className="bg-green-100 text-green-900">
            <tr>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Médecin</th>
              <th className="px-4 py-2 border-b">Compte rendu</th>
              <th className="px-4 py-2 border-b">Ordonnance</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((c) => (
              <tr key={c._id} className="even:bg-green-50">
                <td className="px-4 py-2 border-b">{new Date(c.date).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{c.medecinId.name}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => downloadPDF(`Compte_Rendu_${c._id}`, c.compteRendu)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Télécharger
                  </button>
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => downloadPDF(`Ordonnance_${c._id}`, c.ordonnance)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Télécharger
                  </button>
                </td>
              </tr>
            ))}
            {consultations.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  Aucune consultation terminée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
