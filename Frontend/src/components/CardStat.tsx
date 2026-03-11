// src/components/patient/StatsHome.tsx
type Props = { stats: any; userName?: string };

export default function StatsHome({ stats, userName }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Bienvenue {userName}
      </h2>
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
    </div>
  );
}
