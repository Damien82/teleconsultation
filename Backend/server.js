// server.js
import app from "./app.js"; // app a déjà express.json() dedans
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

// Création serveur HTTP
const server = http.createServer(app);

// Socket.IO pour chat consultation
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connecté :", socket.id);

  // Rejoindre une consultation (room = rdvId)
  socket.on("join-consultation", ({ rdvId }) => {
    socket.join(rdvId);
    console.log(`Utilisateur ${socket.id} a rejoint la consultation ${rdvId}`);
  });

  // Envoi d'un message
  socket.on("send-message", ({ rdvId, message }) => {
    // Émettre aux autres participants de la room
    socket.to(rdvId).emit("receive-message", message);
  });

  // Déconnexion
  socket.on("disconnect", () => {
    console.log("Socket déconnecté :", socket.id);
  });
});

// Démarrage serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
