import { useState } from "react";
import { FaUserPlus, FaTimes, FaUser, FaEnvelope, FaLock, FaPlusCircle } from "react-icons/fa";

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

  // Vérification si le formulaire est valide
  const isFormValid = name.trim() !== "" && email.trim() !== "" && password.length >= 6;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        {/* Bouton Fermer */}
        <button
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group"
          onClick={close}
        >
          <FaTimes className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-[1.5rem] flex items-center justify-center mb-4 shadow-sm">
            <FaUserPlus size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Nouveau Praticien
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Remplissez les informations pour créer un compte médecin.
          </p>
        </div>

        {/* Formulaire */}
        <div className="space-y-5">
          <div className="group space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Nom complet</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors" />
              <input
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-600/30 focus:ring-4 focus:ring-green-600/5 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300"
                placeholder="Ex: Dr. Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="group space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Adresse Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors" />
              <input
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-600/30 focus:ring-4 focus:ring-green-600/5 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300"
                placeholder="jean.dupont@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="group space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Mot de passe provisoire</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors" />
              <input
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-600/30 focus:ring-4 focus:ring-green-600/5 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300"
                type="password"
                placeholder="6 caractères min."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mt-10">
          <button
            className="py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all active:scale-95"
            onClick={close}
          >
            Annuler
          </button>
          <button
            disabled={!isFormValid}
            className={`py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
              isFormValid 
              ? "bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70"
            }`}
            onClick={() => onAdd({ name, email, password })}
          >
            <FaPlusCircle /> Créer le compte
          </button>
        </div>
      </div>
    </div>
  );
}