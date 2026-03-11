// src/components/patient/MesRDVTable.tsx
import { FaSms } from "react-icons/fa";

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
    if (confirm("Voulez-vous vraiment annuler ce RDV ?")) {
      await fetch(`https://teleconsultation-m2ii.onrender.com/api/patient/rdvs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });
      load();
    }
  };

  return (
    <div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Rechercher un RDV par médecin"
          className="border p-2 w-full rounded"
          value={searchRDV}
          onChange={(e) => setSearchRDV(e.target.value)}
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-bold text-green-700 mb-4">Mes rendez-vous</h3>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-green-200">
            <tr>
              <th className="p-3 text-left">Médecin</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRDV.map((r) => (
              <tr key={r._id} className="border-b hover:bg-green-50 transition">
                <td className="p-3">{r.medecinId.name}</td>
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
                      className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => handleAnnuler(r._id)}
                    >
                      Annuler
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
