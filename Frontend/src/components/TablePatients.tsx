import React, { useState, useMemo } from "react";
import SearchInput from "./SearchInput";

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
    <>
      <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un patient..." />
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-green-200">
          <tr>
            <th className="p-3 text-left">Nom</th>
            <th className="text-left">Email</th>
            <th className="text-left">Rôle</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p._id} className="border-b hover:bg-green-50 transition">
              <td className="p-3">{p.name}</td>
              <td>{p.email}</td>
              <td>{p.role}</td>
              <td>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                  onClick={() => onDelete(p._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
