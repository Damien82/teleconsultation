import { FaVideo, FaTimes } from "react-icons/fa";

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
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un médecin..."
          className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
          value={searchRDV}
          onChange={(e) => setSearchRDV(e.target.value)}
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="font-bold text-green-700 mb-4 border-b pb-2">Mes rendez-vous</h3>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-green-100 text-green-800">
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
                <td className="p-3 font-medium">{r.medecinId.name}</td>
                <td className="p-3 text-sm">{new Date(r.date).toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    r.statut === "en cours" ? "bg-red-100 text-red-600 animate-pulse" :
                    r.statut === "validé" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {r.statut}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {/* Le patient peut rejoindre si c'est validé ou en cours */}
                  {(r.statut === "validé" || r.statut === "en cours") && (
                    <button
                      className={`flex items-center gap-2 text-white px-3 py-1.5 rounded-lg transition shadow-sm ${
                        r.statut === "en cours" 
                          ? "bg-red-600 hover:bg-red-700 font-bold" 
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      onClick={() => setSelectedRDV(r)}
                    >
                      <FaVideo /> {r.statut === "en cours" ? "Rejoindre l'appel" : "Accéder"}
                    </button>
                  )}
                  
                  {r.statut === "payé" && (
                    <button
                      className="flex items-center gap-1 bg-gray-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition border border-red-200"
                      onClick={() => handleAnnuler(r._id)}
                    >
                      <FaTimes /> Annuler
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRDV.length === 0 && (
          <p className="text-center py-4 text-gray-500 italic">Aucun rendez-vous trouvé.</p>
        )}
      </div>
    </div>
  );
}