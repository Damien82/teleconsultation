import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGetHistoriqueConsultationsPatient } from "../services/api";
import jsPDF from "jspdf";
import { FaFileDownload, FaCalendarAlt, FaUserMd, FaSearch, FaInbox } from "react-icons/fa";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredConsultations = consultations.filter((c) =>
    c.medecinId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = (title: string, content: string, medecinName: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(22, 101, 52); 
    doc.text("TeleConsult - Document Médical", 10, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Praticien : Dr. ${medecinName}`, 10, 35);
    doc.text(`Émis le : ${new Date().toLocaleDateString()}`, 10, 42);
    
    doc.setDrawColor(230);
    doc.line(10, 50, 200, 50);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(title.replace(/_/g, " "), 10, 65);

    doc.setFontSize(12);
    doc.text(content || "Aucun contenu disponible.", 10, 75, { maxWidth: 180 });
    
    doc.save(`${title}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Recherche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mes Documents</h1>
          <p className="text-sm text-slate-500 font-medium">Retrouvez vos comptes-rendus et ordonnances.</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher par médecin..."
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
              <tr className="bg-green-100 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-700 uppercase tracking-widest">Médecin</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-700 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-700 uppercase tracking-widest">Compte Rendu</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-700 uppercase tracking-widest">Ordonnance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 animate-pulse font-medium">Chargement de vos documents...</td>
                </tr>
              ) : filteredConsultations.length > 0 ? (
                filteredConsultations.map((c) => (
                  <tr key={c._id} className="group hover:bg-[#FBFCFB] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                          <FaUserMd />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Dr. {c.medecinId.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FaCalendarAlt size={13} className="opacity-40" />
                        {new Date(c.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => downloadPDF(`Compte_Rendu`, c.compteRendu, c.medecinId.name)}
                        className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all transform active:scale-95"
                      >
                        <FaFileDownload /> PDF
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => downloadPDF(`Ordonnance`, c.ordonnance, c.medecinId.name)}
                        className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all transform active:scale-95"
                      >
                        <FaFileDownload /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <FaInbox size={48} />
                      <p className="text-sm font-bold">Aucun document trouvé</p>
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