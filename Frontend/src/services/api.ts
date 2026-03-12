const API_URL = "https://teleconsultation-m2ii.onrender.com/api";

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`,
  };
};

/* ================= AUTH ================= */

export const apiLogin = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login incorrect");
  return res.json();
};

export const apiRegister = async (data: { name: string; email: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur inscription");
  return res.json();
};

/* ================= ADMIN ================= */

export const apiGetPatients = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/patients`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const apiDeletePatient = async (id: string, token: string) => {
  await fetch(`${API_URL}/admin/patients/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const apiGetMedecins = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/doctors`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // token ajouté ici
    },
  });
  return res.json();
};


export const apiAddMedecin = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/admin/doctors`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


// src/services/api.ts
export const apiDeleteMedecin = async (id: string, token: string) => {
  await fetch(`${API_URL}/admin/doctors/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const apiGetStatsAdmin = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // token ajouté ici
    },
  });
  return res.json();
};


/* ================= PATIENT ================= */

export const apiGetMesRDV = async (token: string) => {
  const res = await fetch(`${API_URL}/patient/rdvs`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const apiGetStatsPatient = async (token: string) => {
  const res = await fetch(`${API_URL}/patient/stats`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};


export const apiPrendreRDV = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/patient/rdv`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const apiAnnulerRDV = async (rdvId: string, token: string) => {
  const res = await fetch(`${API_URL}/patient/rdvs/${rdvId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const apiGetStatsPatientGraph = async (token: string) => {
  const res = await fetch(`${API_URL}/patient/getStatsPatientgraph`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Impossible de récupérer les stats graphiques");
  return res.json(); // doit retourner quelque chose comme : { history: [ { month, rdvs, consultations } ] }
};

/* ================= MEDECIN ================= */

export const apiGetRDVsMedecin = async (token: string) => {
  const res = await fetch(`${API_URL}/medecin/rdvs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur récupération RDVs médecin");
  return res.json();
};


export const apiValiderRDV = async (rdvId: string, token: string) => {
  const res = await fetch(`${API_URL}/medecin/rdv/${rdvId}/valider`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur validation RDV");
  return res.json();
};


// src/services/api.ts
export const apiTerminerConsultation = async (
  rdvId: string,
  data: { compteRendu: string; ordonnance: string },
  token: string
) => {
  const res = await fetch(`${API_URL}/consultations/terminer/${rdvId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erreur API terminer consultation");
  return res.json();
};


export const apiGetStatsMedecin = async (token: string) => {
  const res = await fetch(`${API_URL}/medecin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur récupération stats médecin");
  return res.json();
};


export const apiDemarrerConsultation = async (rdvId: string) => {
  const res = await fetch(`https://teleconsultation-m2ii.onrender.com/api/medecin/rdv/${rdvId}/start`, {
    method: "PUT",
    headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
  });
  return res.json();
};

export const apiSaveConsultation = async (formData: FormData) => {
  const res = await fetch(`${API_URL}/consultation/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Erreur API");
  return res.json();
};

// src/services/api.ts
export const apiCreateConsultation = async (formData: FormData) => {
  const res = await fetch(`${API_URL}/consultation/`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};
export const apiGetHistoriqueConsultations = async (token: string) => {
  const res = await fetch(`${API_URL}/consultations/historique`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur récupération historique consultations");
  }

  return res.json();
};
// src/services/api.ts
export const apiGetHistoriqueConsultationsPatient = async (token: string) => {
  const res = await fetch("https://teleconsultation-m2ii.onrender.com/api/consultations/historique/patient", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erreur API historique patient");
  return res.json();
};

// Ajoute ceci dans src/services/api.ts

export const apiGetAgoraToken = async (rdvId: string, userId: string) => {
  try {
    const response = await fetch(`https://teleconsultation-m2ii.onrender.com/api/agora/token/${rdvId}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Ajoute ton header d'autorisation si nécessaire
        // "Authorization": `Bearer ${token}` 
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du token Agora");
    }

    return await response.json(); 
    // Doit retourner : { appId: string, token: string, channel: string }
  } catch (error) {
    console.error("apiGetAgoraToken error:", error);
    throw error;
  }
};


