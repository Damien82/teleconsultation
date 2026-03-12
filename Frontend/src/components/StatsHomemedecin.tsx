import { FaCheckCircle, FaStethoscope, FaChartLine } from "react-icons/fa";
import StatsGraph from "./StatsGraph";

type Props = {
  stats: any;
  statsGraph?: any[];
  userName?: string;
};

export default function StatsHome({ stats, statsGraph, userName }: Props) {
  return (
    <div className="space-y-8">
      {/* Header de bienvenue */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Bienvenue, <span className="text-green-600">Docteur {userName}</span>
        </h2>
        <p className="text-slate-500 mt-1 font-medium">Voici l'aperçu de votre activité aujourd'hui.</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Carte RDV Validés */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">RDV validés</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.rdvsValides || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <FaCheckCircle />
            </div>
          </div>
          {/* Petit accent décoratif en fond */}
          <div className="absolute -bottom-2 -right-2 text-green-600/5 text-6xl rotate-12 pointer-events-none">
            <FaCheckCircle />
          </div>
        </div>

        {/* Carte Consultations */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consultations</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.consultations || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <FaStethoscope />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 text-blue-600/5 text-6xl rotate-12 pointer-events-none">
            <FaStethoscope />
          </div>
        </div>

        {/* Optionnel : Ajout d'une troisième carte pour l'équilibre visuel (ex: Tendance) */}
        <div className="hidden lg:block bg-green-600 rounded-[2rem] p-6 shadow-lg shadow-green-100 relative overflow-hidden">
          <div className="relative z-10 text-white">
            <p className="text-[11px] font-bold text-green-100 uppercase tracking-widest mb-1">Performance</p>
            <h3 className="text-xl font-bold italic">Services Optimisés</h3>
            <p className="text-xs text-green-50 mt-2 font-medium">Votre efficacité est en hausse de 12%.</p>
          </div>
          <FaChartLine className="absolute bottom-4 right-4 text-white/20 text-5xl" />
        </div>
      </div>

      {/* Section Graphique */}
      {statsGraph && statsGraph.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Analyse de l'activité hebdomadaire</h3>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm">
            <div className="h-[300px] w-full">
               <StatsGraph data={statsGraph} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}