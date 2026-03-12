import { useEffect, useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { apiGetHistoriqueConsultations } from "../../src/services/api";
import jsPDF from "jspdf";
import { FaFileDownload, FaCalendarAlt, FaFileAlt, FaSearch } from "react-icons/fa";

interface Consultation {
  _id: string;
  patientId: { _id: string; name: string };
  medecinId: { _id: string; name: string };
  date: string;
  compteRendu: string;
  ordonnance: string;
}

export default function HistoriqueConsultationMedecin() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche

  const loadConsultations = async () => {
    if (!user) return;
    try {
      const data = await apiGetHistoriqueConsultations(user.token);
      setConsultations(data);
    } catch (err) {
      console.error("Erreur récupération historique :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [user]);

  // Filtrage des consultations
  const filteredConsultations = consultations.filter((c) =>
    c.patientId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = (title: string, content: string, patientName: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(22, 101, 52); 
    doc.text("TeleConsult - Document Médical", 10, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Patient : ${patientName}`, 10, 35);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 10, 42);
    doc.setDrawColor(200);
    doc.line(10, 50, 200, 50);
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(title.replace(/_/g, " "), 10, 65);
    doc.setFontSize(12);
    doc.text(content || "Aucun contenu saisi pour cette section.", 10, 75, { maxWidth: 190 });
    doc.save(`${title}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Recherche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historique des consultations</h1>
          <p className="text-sm text-slate-500 font-medium">Consultez et téléchargez les documents de vos anciens patients.</p>
        </div>

        {/* Barre de recherche stylisée */}
        <div className="relative w-full md:w-80 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#F2F4F2] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm text-slate-700"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden border border-slate-200/60 rounded-[2rem] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-200 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-black uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-black uppercase tracking-widest">Patient</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-black uppercase tracking-widest">Compte Rendu</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-black uppercase tracking-widest">Ordonnance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredConsultations.length > 0 ? (
                filteredConsultations.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FBFCFB] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 text-slate-600">
                        <FaCalendarAlt className="text-slate-300" size={14} />
                        <span className="text-sm font-medium">
                          {new Date(c.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xs font-bold">
                          {c.patientId.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{c.patientId.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => downloadPDF(`Compte_Rendu_${c._id}`, c.compteRendu, c.patientId.name)}
                        className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all transform active:scale-95"
                      >
                        <FaFileDownload /> PDF
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => downloadPDF(`Ordonnance_${c._id}`, c.ordonnance, c.patientId.name)}
                        className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all transform active:scale-95"
                      >
                        <FaFileDownload /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <FaFileAlt size={40} />
                      <p className="text-sm font-medium">
                        {loading ? "Chargement..." : searchTerm ? "Aucun patient ne correspond à votre recherche." : "Aucune consultation terminée."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}