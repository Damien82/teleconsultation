// src/services/socket.ts
import { io } from "socket.io-client";

// Ici tu mets l'URL de ton backend
const URL = "http://localhost:5000";

const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
