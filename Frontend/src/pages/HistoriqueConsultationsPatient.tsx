import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGetHistoriqueConsultationsPatient } from "../services/api";
import jsPDF from "jspdf";

interface Consultation {
  _id: string;
  patientId: { name: string };
  medecinId: { name: string };
  date: string;
  compteRendu: string;
  ordonnance: string;
}

export default function HistoriqueConsultationsPatient() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistorique = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const data = await apiGetHistoriqueConsultationsPatient(user.token);
      setConsultations(Array.isArray(data) ? data : data.consultations || []);
    } catch (err) {
      console.error("Erreur chargement historique :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) loadHistorique();
  }, [user?.token]);

  const downloadPDF = (title: string, content: string) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 10, 20);
    doc.setFontSize(12);
    doc.text(content || "Aucun contenu", 10, 30, { maxWidth: 190 });
    doc.save(`${title}.pdf`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-green-800">Historique des consultations</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : consultations.length === 0 ? (
        <p>Aucune consultation trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-green-200 rounded">
            <thead className="bg-green-100 text-green-900">
              <tr>
                <th className="px-4 py-2 border-b">Médecin</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Compte rendu</th>
                <th className="px-4 py-2 border-b">Ordonnance</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c) => (
                <tr key={c._id} className="even:bg-green-50">
                  <td className="px-4 py-2 border-b">{c.medecinId.name}</td>
                  <td className="px-4 py-2 border-b">{new Date(c.date).toLocaleString()}</td>
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
