import { FaCreditCard, FaStethoscope, FaChartBar } from "react-icons/fa";
import StatsGraph from "./StatsGraph";

type Props = {
  stats: {
    rdvsPayes: number;
    consultations: number;
  };
  userName?: string;
};

export default function StatsHome({ stats, userName }: Props) {
  // Transformer les stats pour le graphique
  const graphData = [
    { name: "RDV payés", value: stats.rdvsPayes || 0 },
    { name: "Consultations", value: stats.consultations || 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header de bienvenue chaleureux */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Ravi de vous revoir, <span className="text-green-600">{userName}</span>
        </h2>
        <p className="text-slate-500 mt-1 font-medium italic">
          Suivez vos rendez-vous et votre historique de santé en un clin d'œil.
        </p>
      </div>

      {/* Cartes de statistiques stylisées */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Carte RDV Payés */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">RDV payés</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.rdvsPayes || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              <FaCreditCard />
            </div>
          </div>
          {/* Filigrane décoratif */}
          <FaCreditCard className="absolute -bottom-4 -right-4 text-slate-50 text-7xl pointer-events-none group-hover:text-green-50 group-hover:rotate-12 transition-all duration-500" />
        </div>

        {/* Carte Consultations */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Consultations</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.consultations || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center text-xl group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              <FaStethoscope />
            </div>
          </div>
          <FaStethoscope className="absolute -bottom-4 -right-4 text-slate-50 text-7xl pointer-events-none group-hover:text-slate-100 group-hover:-rotate-12 transition-all duration-500" />
        </div>
      </div>

      {/* Zone Graphique */}
      <div className="space-y-4 mt-10">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <FaChartBar size={14} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Aperçu de votre activité</h3>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm">
          <div className="h-[250px] w-full">
            <StatsGraph data={graphData} />
          </div>
        </div>
      </div>
    </div>
  );
}