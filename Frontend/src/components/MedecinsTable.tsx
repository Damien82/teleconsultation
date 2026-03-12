import React, { useState, useMemo } from "react";
import { FaTrashAlt, FaEnvelope, FaInbox, FaSearch, FaUserMd, FaUserSlash } from "react-icons/fa";

type Medecin = {
  _id: string;
  name: string;
  email: string;
};

type Props = {
  medecins: Medecin[];
  onDelete: (id: string) => void;
};

export const MedecinsTable: React.FC<Props> = ({ medecins, onDelete }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return medecins.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [medecins, search]);

  return (
    <div className="space-y-6">
      {/* Barre de recherche & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
            <FaUserMd size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Corps Médical</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {filtered.length} Praticien(s)
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-96 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un médecin..."
            className="w-full pl-12 pr-4 py-3 bg-[#F2F4F2] border border-transparent rounded-[1.5rem] focus:bg-white focus:border-green-600/30 outline-none transition-all text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Conteneur du tableau */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-700 uppercase tracking-widest">Praticien</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-700 uppercase tracking-widest">Coordonnées</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold text-slate-700 uppercase tracking-widest">Gestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((m) => (
                  <tr key={m._id} className="group hover:bg-[#FBFCFB] transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 font-bold shadow-sm">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-green-700 transition-colors italic">
                            Dr. {m.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">ID: {m._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <FaEnvelope className="text-slate-300" size={12} />
                        {m.email}
                      </div>
                    </td>

                    {/* BOUTON REFAIT : Plus large et plus clair au survol */}
                    <td className="px-8 py-5 text-right">
                      <button
                        className="group/btn relative inline-flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-transparent hover:border-red-100 overflow-hidden"
                        onClick={() => {
                          if(confirm(`Supprimer définitivement le compte du Dr. ${m.name} ?`)) onDelete(m._id);
                        }}
                      >
                        <FaUserSlash className="group-hover/btn:scale-110 transition-transform" />
                        <span>Révoquer</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-8 py-24 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <FaInbox size={40} />
                      <p className="text-sm font-bold">Aucun praticien trouvé</p>
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
};