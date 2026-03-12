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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FaUsers, FaUserMd, FaCalendarCheck, FaPlus, FaChartLine } from "react-icons/fa";

type Stats = { patients: number; medecins: number; rdvs: number; };

export default function AdminDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [medecins, setMedecins] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({ patients: 0, medecins: 0, rdvs: 0 });
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      // Chargement simultané pour plus de rapidité
      const [resP, resM, resS] = await Promise.all([
        apiGetPatients(user.token),
        apiGetMedecins(user.token),
        apiGetStatsAdmin(user.token)
      ]);
      setPatients(resP);
      setMedecins(resM);
      setStats(resS);
    } catch (err) {
      console.error("Erreur lors de la récupération des données", err);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  return (
    <DashboardLayout>
      {(active) => (
        <div className="animate-in fade-in duration-500">
          
          {/* --- VUE ACCUEIL (DASHBOARD) --- */}
          {active === "home" && (
            <div className="space-y-8">
              {/* Cartes de Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Patients", value: stats.patients, icon: <FaUsers />, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Médecins", value: stats.medecins, icon: <FaUserMd />, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Rendez-vous", value: stats.rdvs, icon: <FaCalendarCheck />, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphique Stylisé */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <FaChartLine />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Activité Globale</h3>
                    <p className="text-xs text-slate-400 font-medium">Répartition des flux de la plateforme</p>
                  </div>
                </div>
                
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Patients", value: stats.patients },
                        { name: "Médecins", value: stats.medecins },
                        { name: "Consultations", value: stats.rdvs }
                      ]}
                      margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                        dy={15}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" fill="#16a34a" radius={[10, 10, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* --- VUE PATIENTS --- */}
          {active === "patients" && (
            <PatientsTable patients={patients} onDelete={(id) => {
              if(confirm("Supprimer ce patient ?")) { apiDeletePatient(id, user!.token); fetchData(); }
            }} />
          )}

          {/* --- VUE MÉDECINS --- */}
          {active === "medecins" && (
            <div className="space-y-6">
              <div className="flex justify-end px-2">
                <button
                  className="bg-green-600 text-white px-6 py-3.5 rounded-[1.2rem] hover:bg-green-700 transition-all shadow-lg shadow-slate-200 flex items-center gap-2 font-bold text-sm active:scale-95"
                  onClick={() => setShowModal(true)}
                >
                  <FaPlus size={12} />
                  Nouveau Praticien
                </button>
              </div>
              
              <MedecinsTable medecins={medecins} onDelete={(id) => {
                if(confirm("Révoquer ce médecin ?")) { apiDeleteMedecin(id, user!.token); fetchData(); }
              }} />
              
              {showModal && (
                <Modal
                  close={() => setShowModal(false)}
                  onAdd={async (data: any) => {
                    await apiAddMedecin(data, user!.token);
                    setShowModal(false);
                    fetchData();
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}