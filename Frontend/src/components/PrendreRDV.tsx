import { FaUserMd, FaCalendarAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

type Props = {
  medecins: any[];
  medecinId: string;
  setMedecinId: (id: string) => void;
  date: string;
  setDate: (d: string) => void;
  prendreRDV: () => Promise<void>;
};

export default function PrendreRDVTable({
  medecins,
  medecinId,
  setMedecinId,
  date,
  setDate,
  prendreRDV,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (!medecinId || !date) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await prendreRDV();
      // On pourrait remplacer l'alert par un état de succès visuel ici
      alert("Rendez-vous envoyé avec succès !");
    } catch (error) {
      alert("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl">
          <FaCalendarAlt />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Nouveau Rendez-vous</h3>
          <p className="text-sm text-slate-500 font-medium">Réservez votre téléconsultation en quelques clics</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Choix du médecin */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Choisir votre praticien
          </label>
          <div className="relative group">
            <FaUserMd className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
            <select
              className="w-full pl-11 pr-4 py-3.5 bg-[#F2F4F2] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm font-medium text-slate-700 appearance-none"
              onChange={(e) => setMedecinId(e.target.value)}
              value={medecinId}
            >
              <option value="">Sélectionnez un médecin...</option>
              {medecins.map((m) => (
                <option key={m._id} value={m._id}>
                  Dr. {m.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Choix de la date */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Date et heure souhaitées
          </label>
          <div className="relative group">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
            <input
              type="datetime-local"
              className="w-full pl-11 pr-4 py-3.5 bg-[#F2F4F2] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm font-medium text-slate-700"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Note informative */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3">
          <FaCheckCircle className="text-blue-500 mt-0.5" size={14} />
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Votre rendez-vous sera validé par le médecin après confirmation du paiement. Vous recevrez une notification par SMS.
          </p>
        </div>

        {/* Bouton d'action */}
        <button
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            isSubmitting 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-green-600 text-white hover:bg-green-700 shadow-green-100 hover:shadow-green-200 transform hover:-translate-y-0.5 active:translate-y-0"
          }`}
          onClick={handleClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Traitement en cours..."
          ) : (
            <>
              <FaCreditCard /> Payer & Confirmer le rendez-vous
            </>
          )}
        </button>
      </div>
    </div>
  );
}