// src/components/StatsHome.tsx
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
    <div>
      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Bienvenue {userName}
      </h2>

      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
          <h3 className="text-sm font-semibold text-green-500">RDV payés</h3>
          <p className="text-2xl font-bold">{stats.rdvsPayes || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
          <h3 className="text-sm font-semibold text-green-500">Consultations</h3>
          <p className="text-2xl font-bold">{stats.consultations || 0}</p>
        </div>
      </div>

      {/* Graphique simple */}
      <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
        <StatsGraph data={graphData} />
      </div>
    </div>
  );
}
