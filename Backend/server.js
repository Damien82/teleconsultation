// server.js
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import RDV from "./models/RDV.js"; // modèle RDV pour sauvegarder roomId

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://teleconsultation-eosin.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Stockage utilisateurs par room
const usersInRoom = {}; // { roomId: { socketId: role } }

io.on("connection", (socket) => {
  console.log("Socket connecté :", socket.id);

  // Rejoindre une consultation / room
  socket.on("join-consultation", async ({ rdvId, userId, role }) => {
    try {
      let roomId = `consult-${rdvId}`;
      const rdv = await RDV.findById(rdvId);

      // Si le médecin valide et roomId inexistant → créer
      if (!rdv.roomId && role === "medecin") {
        rdv.roomId = roomId;
        await rdv.save();
      } else if (rdv.roomId) {
        roomId = rdv.roomId;
      }

      socket.join(roomId);

      if (!usersInRoom[roomId]) usersInRoom[roomId] = {};
      usersInRoom[roomId][socket.id] = role;

      console.log(`Utilisateur ${socket.id} a rejoint la room ${roomId} (${role})`);

      // Notifier tous les autres dans la room
      socket.to(roomId).emit("user-connected", { socketId: socket.id, role });

      // Si médecin et patient déjà là → notifier médecin
      if (role === "medecin") {
        for (const sId in usersInRoom[roomId]) {
          if (usersInRoom[roomId][sId] === "patient") {
            socket.emit("patient-connected", { patientSocketId: sId });
          }
        }
      }

      // Si patient et médecin déjà là → notifier patient
      if (role === "patient") {
        for (const sId in usersInRoom[roomId]) {
          if (usersInRoom[roomId][sId] === "medecin") {
            socket.emit("medecin-connected", { medecinSocketId: sId });
          }
        }
      }
    } catch (err) {
      console.error("Erreur join-consultation :", err);
    }
  });

  // Signaux WebRTC
  socket.on("webrtc-signal", ({ roomId, signal, from }) => {
    socket.to(roomId).emit("webrtc-signal", { signal, from });
  });

  // Chat
  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", message);
  });

  // Déconnexion
  socket.on("disconnect", () => {
    for (const roomId in usersInRoom) {
      if (usersInRoom[roomId][socket.id]) {
        const role = usersInRoom[roomId][socket.id];
        delete usersInRoom[roomId][socket.id];

        // Prévenir les autres
        socket.to(roomId).emit(`${role}-disconnected`, { socketId: socket.id });

        console.log(`Utilisateur ${socket.id} (${role}) a quitté la room ${roomId}`);

        // Supprimer room vide
        if (Object.keys(usersInRoom[roomId]).length === 0) {
          delete usersInRoom[roomId];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Serveur démarré sur https://teleconsultation-m2ii.onrender.com:${PORT}`)
);