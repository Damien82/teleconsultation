// src/components/MedecinsTable.tsx
import React, { useState, useMemo } from "react";
import SearchInput from "./SearchInput";

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

  // Filtrage des médecins par nom ou email
  const filtered = useMemo(() => {
    return medecins.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [medecins, search]);

  if (medecins.length === 0)
    return <div className="p-4 text-gray-500">Aucun médecin disponible.</div>;

  return (
    <div>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un médecin..."
      />

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-green-200">
          <tr>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m._id} className="border-b hover:bg-green-50 transition">
              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.email}</td>
              <td className="p-3">
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                  onClick={() => onDelete(m._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-500">
                Aucun résultat trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
