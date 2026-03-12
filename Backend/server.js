import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import RDV from "./src/models/RendezVous.js";
// Utilisation de require pour agora car le package n'est pas toujours compatible ES Modules pur
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://teleconsultation-eosin.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- ROUTE API POUR AGORA TOKEN ---
// On l'ajoute directement sur 'app' avant les sockets
app.get("/api/agora/token/:rdvId/:userId", async (req, res) => {
  const rdv = await RDV.findById(req.params.rdvId);
  
  // SÉCURITÉ : Le patient ne peut avoir un token QUE si le médecin a démarré
  if (!rdv || rdv.statut !== "en cours") {
    return res.status(403).json({ error: "La consultation n'a pas encore démarré." });
  }
  try {
    const { rdvId } = req.params;
    const APP_ID = process.env.AGORA_APP_ID;
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

    if (!APP_ID || !APP_CERTIFICATE) {
      return res.status(500).json({ error: "Configuration Agora manquante sur le serveur" });
    }

    const channelName = `consult-${rdvId}`;
    const uid = 0; // 0 permet à Agora de générer un UID numérique automatiquement
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 heure
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    res.json({ appId: APP_ID, token, channel: channelName });
  } catch (error) {
    console.error("Erreur génération token:", error);
    res.status(500).send("Erreur serveur");
  }
});

// --- LOGIQUE SOCKET.IO ---
const usersInRoom = {};

io.on("connection", (socket) => {
  console.log("Socket connecté :", socket.id);

  socket.on("join-consultation", async ({ rdvId, userId, role }) => {
    try {
      let roomId = `consult-${rdvId}`;
      const rdv = await RDV.findById(rdvId);
      if (!rdv) return;

      if (!rdv.roomId && role === "medecin") {
        rdv.roomId = roomId;
        await rdv.save();
      } else if (rdv.roomId) {
        roomId = rdv.roomId;
      }

      socket.join(roomId);
      if (!usersInRoom[roomId]) usersInRoom[roomId] = {};
      usersInRoom[roomId][socket.id] = role;

      // Notifier l'autre utilisateur pour débloquer le bouton "Rejoindre" côté patient
      if (role === "medecin") {
        socket.to(roomId).emit("medecin-joined");
      }

      console.log(`User ${socket.id} (${role}) rejoint ${roomId}`);
    } catch (err) {
      console.error("Erreur join-consultation :", err);
    }
  });

  // Chat
  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", message);
  });

  // Signal pour notifier le patient que le médecin a cliqué sur "Rejoindre l'appel" (bouton bleu)
  socket.on("medecin-joined", ({ rdvId }) => {
    socket.to(`consult-${rdvId}`).emit("medecin-joined");
  });

  socket.on("disconnect", () => {
    for (const roomId in usersInRoom) {
      if (usersInRoom[roomId][socket.id]) {
        const role = usersInRoom[roomId][socket.id];
        delete usersInRoom[roomId][socket.id];
        socket.to(roomId).emit(`${role}-disconnected`, { socketId: socket.id });
        if (Object.keys(usersInRoom[roomId]).length === 0) delete usersInRoom[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Serveur démarré sur le port ${PORT}`)
);