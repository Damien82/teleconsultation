// src/pages/medecin/MedecinDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MedecinLayout from "../../components/MedecinLayout";
import ConsultationChatModal from "../../components/ConsultationChatModal";
import StatsHome from "../../components/StatsHomemedecin";
import HistoriqueConsultationMedecin from "../HistoriqueConsultationMedecin";
import MesRDVTableMedecin from "../../components/MesRDVTableMedecin";
import socket from "../../services/socket";
import { apiGetRDVsMedecin, apiGetStatsMedecin, apiValiderRDV } from "../../services/api";

export default function MedecinDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"home" | "mesRDV" | "historique">("home");
  const [rdvs, setRdvs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [statsGraph, setStatsGraph] = useState<any[]>([]);
  const [selectedRDV, setSelectedRDV] = useState<any>(null);
  const [searchRDV, setSearchRDV] = useState("");

  // Charger les RDVs du médecin
  const loadRDVs = async () => {
    if (!user?.token) return;
    try {
      const data = await apiGetRDVsMedecin(user.token);
      setRdvs(Array.isArray(data) ? data : data.rdvs || []);
    } catch (err) {
      console.error("Erreur RDVs médecin", err);
    }
  };

  // Charger les stats du médecin
  const loadStats = async () => {
    if (!user?.token) return;
    try {
      const res = await apiGetStatsMedecin(user.token);
      const s = res.stats ?? res;
      setStats(s);
      setStatsGraph([
        { name: "Consultations", value: Number(s.consultations ?? 0) },
      ]);
    } catch (err) {
      console.error("Erreur stats médecin", err);
    }
  };

  useEffect(() => {
    if (!user?.token) return;
    loadRDVs();
    loadStats();
  }, [user?.token]);

  // Valider un RDV payé
  const validerRDV = async (rdvId: string) => {
    if (!user) return;
    if (confirm("Voulez-vous valider ce RDV ?")) {
      await apiValiderRDV(rdvId, user.token);
      loadRDVs();
      loadStats();
    }
  };

  // Retirer un RDV terminé
  const removeRDVFromList = (rdvId: string) => {
    setRdvs(prev => prev.filter(r => r._id !== rdvId));
  };

  return (
    <MedecinLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Statistiques */}
      {activeTab === "home" && (
        <StatsHome stats={stats} statsGraph={statsGraph} userName={user?.name} />
      )}

      {/* Mes RDVs */}
      {activeTab === "mesRDV" && (
        <MesRDVTableMedecin
          rdvs={rdvs}
          searchRDV={searchRDV}
          setSearchRDV={setSearchRDV}
          userToken={user!.token}
          load={loadRDVs}
          setSelectedRDV={setSelectedRDV}
          validerRDV={validerRDV}
        />
      )}

      {/* Historique */}
      {activeTab === "historique" && <HistoriqueConsultationMedecin />}

      {/* Modal consultation/chat */}
      {selectedRDV && user && (
        <ConsultationChatModal
          rdvId={selectedRDV._id}
          role="medecin"
          onClose={() => setSelectedRDV(null)}
          removeRDVFromList={removeRDVFromList}
          removeRDVFromPatientList={(id) => {
            // ⚡ Notifier le patient pour supprimer le RDV
            socket.emit("rdv-termine", { rdvId: id });
          }}
        />
      )}
    </MedecinLayout>
  );
}
