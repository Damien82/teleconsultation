// server.js
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://teleconsultation-eosin.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Stockage des utilisateurs et consultations
const users = {};         // { socketId: { rdvId, userId, role } }
const consultations = {}; // { rdvId: { medecin?: socketId, patient?: socketId } }

io.on("connection", (socket) => {
  console.log("Socket connecté :", socket.id);

  // Rejoindre une consultation
  socket.on("join-consultation", ({ rdvId, userId, role }) => {
    socket.join(rdvId);
    users[socket.id] = { rdvId, userId, role };

    if (!consultations[rdvId]) consultations[rdvId] = {};
    if (role === "medecin") {
      consultations[rdvId].medecin = socket.id;

      // Si le patient est déjà connecté, notifier le médecin immédiatement
      const patientId = consultations[rdvId].patient;
      if (patientId) {
        io.to(socket.id).emit("patient-connected", { patientSocketId: patientId });
      }
    }

    if (role === "patient") {
      consultations[rdvId].patient = socket.id;

      // Notifier le médecin que le patient est là
      const medSocketId = consultations[rdvId].medecin;
      if (medSocketId) {
        io.to(medSocketId).emit("patient-connected", { patientSocketId: socket.id });
      }
    }

    console.log(`Utilisateur ${socket.id} a rejoint la consultation ${rdvId} (${role})`);
  });

  // Chat
  socket.on("send-message", ({ rdvId, message }) => {
    socket.to(rdvId).emit("receive-message", message);
  });

  // WebRTC – Appel du médecin vers le patient
  socket.on("call-user", ({ targetSocketId, signalData }) => {
    if (users[socket.id]?.role !== "medecin") {
      console.log("Appel non autorisé pour :", socket.id);
      return;
    }

    io.to(targetSocketId).emit("receive-call", {
      from: socket.id,
      signal: signalData,
    });
  });

  // WebRTC – Réponse du patient
  socket.on("answer-call", ({ toSocketId, signal }) => {
    io.to(toSocketId).emit("call-accepted", signal);
  });

  // Déconnexion
  socket.on("disconnect", () => {
    const rdvId = users[socket.id]?.rdvId;
    const role = users[socket.id]?.role;

    if (rdvId && consultations[rdvId]) {
      if (role === "medecin") {
        delete consultations[rdvId].medecin;
        // Optionnel : prévenir le patient que le médecin s'est déconnecté
        const patientId = consultations[rdvId].patient;
        if (patientId) io.to(patientId).emit("medecin-disconnected");
      }

      if (role === "patient") {
        delete consultations[rdvId].patient;
        // Optionnel : prévenir le médecin que le patient s'est déconnecté
        const medSocketId = consultations[rdvId].medecin;
        if (medSocketId) io.to(medSocketId).emit("patient-disconnected");
      }

      // Si la consultation est vide, supprimer l'objet
      if (!consultations[rdvId].medecin && !consultations[rdvId].patient) {
        delete consultations[rdvId];
      }
    }

    delete users[socket.id];
    console.log("Socket déconnecté :", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Serveur démarré sur https://teleconsultation-m2ii.onrender.com:${PORT}`)
);