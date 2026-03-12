import { FaSms, FaSearch, FaUserMd, FaCalendarCheck, FaTimesCircle, FaVideo } from "react-icons/fa";

type Props = {
  rdvs: any[];
  searchRDV: string;
  setSearchRDV: (val: string) => void;
  userToken: string;
  load: () => void;
  setSelectedRDV: (rdv: any) => void;
};

export default function MesRDVTable({ rdvs, searchRDV, setSearchRDV, userToken, load, setSelectedRDV }: Props) {
  const filteredRDV = rdvs.filter((r) =>
    r.medecinId.name.toLowerCase().includes(searchRDV.toLowerCase())
  );

  const handleAnnuler = async (id: string) => {
    if (confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) {
      try {
        // Correction de l'URL vers ton serveur Render
        await fetch(`https://teleconsultation-m2ii.onrender.com/api/patient/rdvs/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userToken}` },
        });
        load();
      } catch (err) {
        console.error("Erreur annulation:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Recherche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-800">Mes prochains rendez-vous</h3>
        
        <div className="relative w-full md:w-80 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher par médecin..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm text-slate-700 shadow-sm"
            value={searchRDV}
            onChange={(e) => setSearchRDV(e.target.value)}
          />
        </div>
      </div>

      {/* Conteneur Tableau */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-700 uppercase tracking-widest">Médecin</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-700 uppercase tracking-widest">Date & Heure</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-700 uppercase tracking-widest">Statut</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-700 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRDV.length > 0 ? (
                filteredRDV.map((r) => (
                  <tr key={r._id} className="group hover:bg-[#FBFCFB] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                          <FaUserMd />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Dr. {r.medecinId.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-slate-600">
                        {new Date(r.date).toLocaleString('fr-FR', { 
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        r.statut === "en cours" ? "bg-red-100 text-red-600 animate-pulse" :
                        r.statut === "validé" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        {r.statut}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {/* --- CONDITION CORRIGÉE ICI --- */}
                        {(r.statut === "validé" || r.statut === "en cours") && (
                          <button
                            className={`flex items-center gap-2 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all transform active:scale-95 ${
                              r.statut === "en cours" 
                                ? "bg-red-600 hover:bg-red-700 shadow-red-100" 
                                : "bg-green-600 hover:bg-green-700 shadow-green-100"
                            }`}
                            onClick={() => setSelectedRDV(r)}
                          >
                            <FaVideo size={14} /> 
                            {r.statut === "en cours" ? "Rejoindre l'appel" : "Accéder"}
                          </button>
                        )}

                        {r.statut === "payé" && (
                          <button
                            className="flex items-center gap-2 bg-slate-100 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-all transform active:scale-95 border border-transparent hover:border-red-100"
                            onClick={() => handleAnnuler(r._id)}
                          >
                            <FaTimesCircle size={14} /> Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <FaCalendarCheck size={40} />
                      <p className="text-sm font-medium">Aucun rendez-vous trouvé.</p>
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