// src/components/Modal.tsx
import { useState } from "react";
import { FaUserPlus, FaTimes } from "react-icons/fa";

export default function Modal({
  close,
  onAdd,
}: {
  close: () => void;
  onAdd: (data: any) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-2xl shadow-xl relative">
        {/* Bouton fermer */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-xl"
          onClick={close}
        >
          <FaTimes />
        </button>

        {/* Titre */}
        <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
          <FaUserPlus /> Ajouter Médecin
        </h2>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <input
            className="w-full p-3 border rounded-lg focus:outline-green-500 focus:ring-1 focus:ring-green-400 transition"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-green-500 focus:ring-1 focus:ring-green-400 transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-green-500 focus:ring-1 focus:ring-green-400 transition"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={close}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            onClick={() => onAdd({ name, email, password })}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}