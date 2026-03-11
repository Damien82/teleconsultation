import StatsGraph from "./StatsGraph";

type Props = {
  stats: any;
  statsGraph?: any[];   // ✅ AJOUT ICI
  userName?: string;
};

export default function StatsHome({ stats, statsGraph, userName }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Bienvenue {userName}
      </h2>

      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold text-green-500">RDV validés</h3>
          <p className="text-2xl font-bold">{stats.rdvsValides || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold text-green-500">Consultations</h3>
          <p className="text-2xl font-bold">{stats.consultations || 0}</p>
        </div>
      </div>

      {/* Graphique */}
      {statsGraph && statsGraph.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <StatsGraph data={statsGraph} />
        </div>
      )}
    </div>
  );
}
