import React, { useState, useMemo } from "react";
import { FaTrashAlt, FaEnvelope, FaInbox, FaSearch, FaUserFriends } from "react-icons/fa";

type Patient = { _id: string; name: string; email: string; role: string };
type Props = { patients: Patient[]; onDelete: (id: string) => void };

export const PatientsTable = ({ patients, onDelete }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [patients, search]);

  return (
    <div className="space-y-6">
      {/* Barre de recherche optimisée */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <FaUserFriends size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Répertoire Patients</h3>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{filtered.length} inscrit(s)</p>
          </div>
        </div>

        <div className="relative w-full md:w-96 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors duration-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email..."
            className="w-full pl-12 pr-4 py-3 bg-[#F2F4F2] border border-transparent rounded-[1.5rem] focus:bg-white focus:border-green-600/30 focus:ring-4 focus:ring-green-600/5 outline-none transition-all duration-300 text-sm font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Conteneur du tableau */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.2em]">Patient</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.2em]">Rôle</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold text-slate-700 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p._id} className="group hover:bg-[#FBFCFB] transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 font-bold text-base shadow-sm">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-green-700 transition-colors">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">Réf: {p._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                          <FaEnvelope className="text-slate-300 group-hover:text-green-500 transition-colors" size={12} />
                        </div>
                        {p.email}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                        {p.role}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <button
                        className="inline-flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:shadow-lg hover:shadow-red-100 transition-all duration-300 transform active:scale-90 border border-transparent hover:border-red-100"
                        onClick={() => {
                          if(confirm(`Voulez-vous supprimer définitivement le compte de ${p.name} ?`)) onDelete(p._id);
                        }}
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                        <FaInbox size={40} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800">Aucun patient trouvé</p>
                        <p className="text-xs text-slate-400 font-medium">Essayez d'ajuster vos filtres de recherche</p>
                      </div>
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