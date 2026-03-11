// src/services/socket.ts
import { io } from "socket.io-client";

// Ici tu mets l'URL de ton backend
const URL = "https://teleconsultation-m2ii.onrender.com";

const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
