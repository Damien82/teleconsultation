// src/components/MesRDVTableMedecin.tsx
import { FaVideo, FaCheck } from "react-icons/fa";
import { apiDemarrerConsultation } from "../services/api"; // Assure-toi de l'avoir créé

// --- AJOUT DE L'INTERFACE PROPS ---
interface Props {
  rdvs: any[];
  searchRDV: string;
  setSearchRDV: (val: string) => void;
  setSelectedRDV: (rdv: any) => void;
  validerRDV: (rdvId: string) => void;
  load: () => void; // Ajouté car présent dans ton type précédent
}

export default function MesRDVTableMedecin({
  rdvs,
  searchRDV,
  setSearchRDV,
  setSelectedRDV,
  validerRDV,
}: Props) {
  
// Dans MesRDVTableMedecin.tsx
const handleDemarrer = async (rdvId: string) => {
  try {
    // Supprime "userToken" ici puisque la fonction le récupère déjà dans le localStorage
    const data = await apiDemarrerConsultation(rdvId); 
    
    if (data.rdv) {
      setSelectedRDV(data.rdv); 
    } else {
      alert("Erreur: " + (data.message || "Impossible de démarrer"));
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau lors du démarrage");
  }
};

  const filteredRDV = rdvs.filter(r =>
    r.patientId.name.toLowerCase().includes(searchRDV.toLowerCase())
  );

  return (
    <div>
      {/* ... recherche ... */}
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
              <td className="p-3 font-medium">{r.patientId.name}</td>
              <td className="p-3">{new Date(r.date).toLocaleString()}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  r.statut === "validé" ? "bg-blue-100 text-blue-700" : 
                  r.statut === "en cours" ? "bg-red-100 text-red-700 animate-pulse" : "bg-gray-100"
                }`}>
                  {r.statut}
                </span>
              </td>
              <td className="p-3 flex gap-2">
                {/* Si validé ou déjà en cours, le médecin peut rejoindre */}
                {(r.statut === "validé" || r.statut === "en cours") && (
                  <button
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition shadow-sm"
                    onClick={() => handleDemarrer(r._id)}
                  >
                    <FaVideo /> {r.statut === "en cours" ? "Continuer" : "Démarrer"}
                  </button>
                )}
                
                {r.statut === "payé" && (
                  <button
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() => validerRDV(r._id)}
                  >
                    <FaCheck /> Valider
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