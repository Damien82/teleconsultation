import { FaSms, FaSearch, FaCalendarDay, FaUserAlt } from "react-icons/fa";

type Props = {
  rdvs: any[];
  searchRDV: string;
  setSearchRDV: (val: string) => void;
  userToken: string;
  load: () => void;
  setSelectedRDV: (rdv: any) => void;
  validerRDV: (rdvId: string) => void;
};

export default function MesRDVTableMedecin({
  rdvs,
  searchRDV,
  setSearchRDV,
  setSelectedRDV,
  validerRDV,
}: Props) {
  const filteredRDV = rdvs.filter(r =>
    r.patientId.name.toLowerCase().includes(searchRDV.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header de la section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mes Rendez-vous</h1>
          <p className="text-sm text-slate-500 font-medium">Gérez vos consultations à venir</p>
        </div>

        {/* Barre de recherche stylisée */}
        <div className="relative w-full md:w-72 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F2F4F2] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm"
            value={searchRDV}
            onChange={e => setSearchRDV(e.target.value)}
          />
        </div>
      </div>

      {/* Table Formatée */}
      <div className="overflow-hidden border border-slate-200/60 rounded-[2rem] bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-200 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-black uppercase tracking-widest">Patient</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-black uppercase tracking-widest">Date & Heure</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-black uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRDV.length > 0 ? (
              filteredRDV.map(r => (
                <tr key={r._id} className="group hover:bg-[#FDFDFD] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
                        <FaUserAlt />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{r.patientId.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <FaCalendarDay className="text-slate-300" />
                      {new Date(r.date).toLocaleString('fr-FR', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      r.statut === "validé" 
                        ? "bg-green-100 text-green-700" 
                        : r.statut === "payé" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {r.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {r.statut === "validé" && (
                        <button
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 shadow-md shadow-green-100 transition-all transform hover:scale-105 active:scale-95"
                          onClick={() => setSelectedRDV(r)}
                        >
                          <FaSms /> Rejoindre
                        </button>
                      )}
                      {r.statut === "payé" && (
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all transform hover:scale-105"
                          onClick={() => validerRDV(r._id)}
                        >
                          Valider
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                  Aucun rendez-vous trouvé...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}