// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  apiGetPatients,
  apiDeletePatient,
  apiGetMedecins,
  apiAddMedecin,
  apiDeleteMedecin,
  apiGetStatsAdmin
} from "../../services/api";
import { PatientsTable } from "../../components/TablePatients";
import { MedecinsTable } from "../../components/MedecinsTable";
import Modal from "../../components/Modal";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Stats = { patients: number; medecins: number; rdvs: number; };

export default function AdminDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [medecins, setMedecins] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({ patients: 0, medecins: 0, rdvs: 0 });
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setPatients(await apiGetPatients(user.token));
    setMedecins(await apiGetMedecins(user.token));
    setStats(await apiGetStatsAdmin(user.token));
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleDeletePatient = async (id: string) => {
    if (!user) return;
    await apiDeletePatient(id, user.token);
    fetchData();
  };

  const handleDeleteMedecin = async (id: string) => {
    if (!user) return;
    await apiDeleteMedecin(id, user.token);
    fetchData();
  };

  return (
    <DashboardLayout>
      {(active) => (
        <>
          {active === "home" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {["Patients", "Médecins", "RDVs"].map((label, i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                    <h2 className="text-sm font-semibold text-green-500">{label}</h2>
                    <p className="text-2xl font-bold">
                      {label === "Patients" ? stats.patients : label === "Médecins" ? stats.medecins : stats.rdvs}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-green-600 font-semibold mb-2">Graphiques</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: "Patients", value: stats.patients },
                      { name: "Médecins", value: stats.medecins },
                      { name: "RDVs", value: stats.rdvs }
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {active === "patients" && (
            <section>
              <PatientsTable patients={patients} onDelete={handleDeletePatient} />
            </section>
          )}

          {active === "medecins" && (
            <section>
              <div className="flex justify-between items-center mb-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  onClick={() => setShowModal(true)}
                >
                  Ajouter Médecin
                </button>
              </div>
              <MedecinsTable medecins={medecins} onDelete={handleDeleteMedecin} />
              {showModal && (
                <Modal
                  close={() => setShowModal(false)}
                  onAdd={async (data: any) => {
                    if (!user) return;
                    await apiAddMedecin(data, user.token);
                    setShowModal(false);
                    fetchData();
                  }}
                />
              )}
            </section>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
