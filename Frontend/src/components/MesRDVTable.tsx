import { FaSms, FaSearch, FaUserMd, FaCalendarCheck, FaTimesCircle } from "react-icons/fa";

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
        await fetch(`http://localhost:5000/api/patient/rdvs/${id}`, {
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
                        r.statut === "validé" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {r.statut}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {r.statut === "validé" && (
                          <button
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 shadow-md shadow-green-100 transition-all transform active:scale-95"
                            onClick={() => setSelectedRDV(r)}
                          >
                            <FaSms size={14} /> Rejoindre
                          </button>
                        )}
                        {r.statut === "payé" && (
                          <button
                            className="flex items-center gap-2 bg-slate-100 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-all transform active:scale-95"
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