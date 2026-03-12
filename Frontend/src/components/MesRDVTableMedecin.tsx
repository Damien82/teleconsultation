import { useState } from "react";
import { FaVideo, FaCheck, FaSearch, FaCalendarDay, FaUserAlt } from "react-icons/fa";
import { apiDemarrerConsultation } from "../services/api";

interface Props {
  rdvs: any[];
  searchRDV: string;
  setSearchRDV: (val: string) => void;
  setSelectedRDV: (rdv: any) => void;
  validerRDV: (rdvId: string) => void;
  load: () => void;
  userToken: string;
}

export default function MesRDVTableMedecin({
  rdvs,
  searchRDV,
  setSearchRDV,
  setSelectedRDV,
  validerRDV,
  userToken,
  load,
}: Props) {

  // La fonction magique qui manquait au nouveau design
  const handleDemarrer = async (rdvId: string) => {
    try {
      console.log("Démarrage de la consultation pour le RDV:", rdvId);
      const data = await apiDemarrerConsultation(rdvId, userToken);
      if (data.rdv) {
        setSelectedRDV(data.rdv); 
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors du démarrage");
    }
  };

  const filteredRDV = rdvs.filter(r =>
    r.patientId.name.toLowerCase().includes(searchRDV.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Recherche (Style Soft Matte) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mes Rendez-vous</h1>
          <p className="text-sm text-slate-500 font-medium">Gérez vos consultations</p>
        </div>

        <div className="relative w-full md:w-72 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-green-600 transition-all text-sm"
            value={searchRDV}
            onChange={e => setSearchRDV(e.target.value)}
          />
        </div>
      </div>

      {/* Table Formatée */}
      <div className="overflow-hidden border border-slate-200/60 rounded-[2rem] bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Patient</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date & Heure</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRDV.map(r => (
              <tr key={r._id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold">
                      {r.patientId.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{r.patientId.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(r.date).toLocaleString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                    r.statut === "en cours" ? "bg-red-100 text-red-600 animate-pulse" :
                    r.statut === "validé" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                  }`}>
                    {r.statut}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {(r.statut === "validé" || r.statut === "en cours") && (
                      <button
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
                        onClick={() => handleDemarrer(r._id)}
                      >
                        <FaVideo /> {r.statut === "en cours" ? "Continuer" : "Démarrer"}
                      </button>
                    )}
                    
                    {r.statut === "payé" && (
                      <button
                        className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
                        onClick={() => validerRDV(r._id)}
                      >
                        <FaCheck /> Valider
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}