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

// On peut stocker les rôles si besoin (optionnel)
const users = {}; // { socketId: { role, userId } }

io.on("connection", (socket) => {
  console.log("Socket connecté :", socket.id);

  // Rejoindre une consultation (room = rdvId)
  socket.on("join-consultation", ({ rdvId, userId, role }) => {
    socket.join(rdvId);
    // Stocker rôle et ID
    users[socket.id] = { rdvId, userId, role };
    console.log(`Utilisateur ${socket.id} a rejoint la consultation ${rdvId} (${role})`);
  });

  // Chat
  socket.on("send-message", ({ rdvId, message }) => {
    socket.to(rdvId).emit("receive-message", message);
  });

  // Signaling WebRTC
  socket.on("call-user", ({ rdvId, signalData, targetSocketId }) => {
    // Vérifier que l'utilisateur est médecin
    if (users[socket.id]?.role !== "medecin") {
      console.log("Appel non autorisé pour :", socket.id);
      return;
    }
    // Envoyer signal à l'autre utilisateur
    io.to(targetSocketId).emit("receive-call", {
      from: socket.id,
      signal: signalData,
    });
  });

  socket.on("answer-call", ({ toSocketId, signal }) => {
    io.to(toSocketId).emit("call-accepted", signal);
  });

  // Déconnexion
  socket.on("disconnect", () => {
    delete users[socket.id];
    console.log("Socket déconnecté :", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Serveur démarré sur https://teleconsultation-m2ii.onrender.com:${PORT}`));