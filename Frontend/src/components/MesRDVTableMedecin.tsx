// src/components/MesRDVTableMedecin.tsx
import { FaSms } from "react-icons/fa";

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
    <div>
      <h1 className="text-2xl font-bold mb-4 text-green-800">Mes Rendez-Vous</h1>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Rechercher un patient"
          className="border p-2 w-full rounded"
          value={searchRDV}
          onChange={e => setSearchRDV(e.target.value)}
        />
      </div>

      <table className="w-full table-auto border-collapse">
        <thead className="bg-green-200">
          <tr>
            <th className="p-3 text-left">Patient</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRDV.map(r => (
            <tr key={r._id} className="border-b hover:bg-green-50 transition">
              <td className="p-3">{r.patientId.name}</td>
              <td className="p-3">{new Date(r.date).toLocaleString()}</td>
              <td className="p-3 capitalize">{r.statut}</td>
              <td className="p-3 flex gap-2">
                {r.statut === "validé" && (
                  <button
                    className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                    onClick={() => setSelectedRDV(r)}
                  >
                    <FaSms /> Rejoindre
                  </button>
                )}
                {r.statut === "payé" && (
                  <button
                    className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() => validerRDV(r._id)}
                  >
                    Valider
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
