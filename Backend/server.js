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

// Stockage des rôles et consultations
const users = {};          // { socketId: { rdvId, userId, role } }
const consultations = {};  // { rdvId: { medecin?: socketId, patient?: socketId } }

io.on("connection", (socket) => {
  console.log("Socket connecté :", socket.id);

  // Rejoindre une consultation (room = rdvId)
  socket.on("join-consultation", ({ rdvId, userId, role }) => {
    socket.join(rdvId);
    users[socket.id] = { rdvId, userId, role };

    if (!consultations[rdvId]) consultations[rdvId] = {};
    if (role === "medecin") consultations[rdvId].medecin = socket.id;
    if (role === "patient") {
      consultations[rdvId].patient = socket.id;

      // Notifier le médecin que le patient est connecté
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

  // Signaling WebRTC : appel du médecin vers le patient
  socket.on("call-user", ({ rdvId, signalData, targetSocketId }) => {
    if (users[socket.id]?.role !== "medecin") {
      console.log("Appel non autorisé pour :", socket.id);
      return;
    }

    io.to(targetSocketId).emit("receive-call", {
      from: socket.id,
      signal: signalData,
    });
  });

  // Réponse du patient à l'appel
  socket.on("answer-call", ({ toSocketId, signal }) => {
    io.to(toSocketId).emit("call-accepted", signal);
  });

  // Déconnexion
  socket.on("disconnect", () => {
    const rdvId = users[socket.id]?.rdvId;
    const role = users[socket.id]?.role;

    if (rdvId && consultations[rdvId]) {
      if (role === "medecin") delete consultations[rdvId].medecin;
      if (role === "patient") delete consultations[rdvId].patient;
    }

    delete users[socket.id];
    console.log("Socket déconnecté :", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Serveur démarré sur https://teleconsultation-m2ii.onrender.com:${PORT}`)
);