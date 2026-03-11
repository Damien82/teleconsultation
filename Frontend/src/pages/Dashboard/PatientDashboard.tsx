import { useEffect, useState } from "react";
import {
  apiGetMedecins,
  apiPrendreRDV,
  apiGetMesRDV,
  apiGetStatsPatient,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PatientLayout from "../../components/PatientLayout";
import StatsHome from "../../components/StatsHome";
import PrendreRDVTable from "../../components/PrendreRDV";
import HistoriqueConsultationsPatient from "../HistoriqueConsultationsPatient";
import MesRDVTable from "../../components/MesRDVTable";
import ConsultationChatModal from "../../components/ConsultationChatModal";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"home" | "prendre" | "mesRDV" | "historique">("home");
  const [medecins, setMedecins] = useState<any[]>([]);
  const [rdvs, setRdvs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [medecinId, setMedecinId] = useState("");
  const [date, setDate] = useState("");
  const [selectedRDV, setSelectedRDV] = useState<any>(null);
  const [searchRDV, setSearchRDV] = useState("");

  const load = async () => {
    if (!user) return;
    const med = await apiGetMedecins(user.token);
    const rdv = await apiGetMesRDV(user.token);
    const s = await apiGetStatsPatient(user.token);
    setMedecins(med);
    setRdvs(rdv);
    setStats(s);
  };

  useEffect(() => { load(); }, [user]);

  const prendreRDV = async () => {
    if (!medecinId || !date || !user) return alert("Choisissez un médecin et une date");
    await apiPrendreRDV({ medecinId, date }, user.token);
    load();
  };

  return (
    <PatientLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "home" && <StatsHome stats={stats} userName={user?.name} />}
      {activeTab === "prendre" && (
        <PrendreRDVTable
          medecins={medecins}
          medecinId={medecinId}
          setMedecinId={setMedecinId}
          date={date}
          setDate={setDate}
          prendreRDV={prendreRDV}
        />
      )}
      {activeTab === "mesRDV" && user && (
        <MesRDVTable
          rdvs={rdvs}
          searchRDV={searchRDV}
          setSearchRDV={setSearchRDV}
          userToken={user.token}
          load={load}
          setSelectedRDV={setSelectedRDV} // sélection RDV pour ouvrir le chat
        />
      )}
      {activeTab === "historique" && user && (
  <HistoriqueConsultationsPatient />
)}

      {/* Modal consultation/chat */}
      {selectedRDV && user && (
        <ConsultationChatModal
          rdvId={selectedRDV._id}
          role="patient"
          onClose={() => setSelectedRDV(null)}
        />
      )}
    </PatientLayout>
  );
}
