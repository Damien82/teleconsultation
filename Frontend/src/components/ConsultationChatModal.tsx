import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";
import { useAuth } from "../context/AuthContext";
import { apiTerminerConsultation } from "../services/api";

// --- TYPES ---
interface Props {
  rdvId: string;
  role: "patient" | "medecin";
  onClose: () => void;
  removeRDVFromList?: (rdvId: string) => void;
  removeRDVFromPatientList?: (rdvId: string) => void;
}

interface Message {
  senderId: string;
  senderRole: "patient" | "medecin";
  content: string;
  createdAt: Date;
}

export default function ConsultationModal({
  rdvId,
  role,
  onClose,
  removeRDVFromList,
  removeRDVFromPatientList,
}: Props) {
  const { user } = useAuth();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [compteRendu, setCompteRendu] = useState("");
  const [ordonnance, setOrdonnance] = useState("");
  const [status, setStatus] = useState<"en_cours" | "termine">("en_cours");

  const userVideo = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const socket = useRef<Socket | null>(null);
  const peersRef = useRef<{ [socketId: string]: Peer.Instance }>({});

  // --- INIT CAMERA + SOCKET ---
  useEffect(() => {
    let localStream: MediaStream;

    const init = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(localStream);
        if (userVideo.current) userVideo.current.srcObject = localStream;

        socket.current = io("https://teleconsultation-m2ii.onrender.com", { withCredentials: true });

        // Rejoindre la room
        socket.current.emit("join-consultation", { rdvId, userId: user?._id, role });

        // Messages entrants
        socket.current.on("receive-message", (msg: Message) => setMessages(prev => [...prev, msg]));

        // WebRTC : un utilisateur s'est connecté
        socket.current.on(
          "user-connected",
          ({ socketId, role: remoteRole }: { socketId: string; role: "medecin" | "patient" }) => {
            if (!localStream) return;
            if ((role === "medecin" && remoteRole === "patient") || (role === "patient" && remoteRole === "medecin")) {
              createPeer(socketId, role === "medecin", localStream);
            }
          }
        );

        // WebRTC : signal reçu
        socket.current.on(
          "webrtc-signal",
          ({ signal, from }: { signal: Peer.SignalData; from: string }) => {
            const peer = peersRef.current[from];
            if (peer) peer.signal(signal);
          }
        );
      } catch (err) {
        console.error("Erreur caméra/micro :", err);
      }
    };

    init();

    return () => {
      Object.values(peersRef.current).forEach(p => p.destroy());
      if (socket.current) socket.current.disconnect();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
    };
  }, [rdvId, role, user?._id]);

  // --- SCROLL CHAT AUTO ---
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // --- ENVOYER MESSAGE ---
  const sendMessage = () => {
    if (!text.trim() || status === "termine") return;
    const msg: Message = { senderId: user?._id || "", senderRole: role, content: text, createdAt: new Date() };
    setMessages(prev => [...prev, msg]);
    socket.current?.emit("send-message", { roomId: `consult-${rdvId}`, message: msg });
    setText("");
  };

  // --- CREATE PEER ---
  const createPeer = (remoteSocketId: string, initiator: boolean, localStream: MediaStream) => {
    const peer = new Peer({ initiator, trickle: false, stream: localStream });

    peer.on("signal", (signalData) => {
      socket.current?.emit("webrtc-signal", {
        roomId: `consult-${rdvId}`,
        signal: signalData,
        from: socket.current?.id,
        to: remoteSocketId,
      });
    });

    peer.on("stream", (remoteStream) => {
      // Ajouter une vidéo pour chaque peer
      const video = document.createElement("video");
      video.srcObject = remoteStream;
      video.autoplay = true;
      video.playsInline = true;
      video.className = "w-1/2 h-48 bg-black";
      remoteVideosRef.current?.appendChild(video);
    });

    peer.on("error", (err) => console.error("Peer error:", err));

    peersRef.current[remoteSocketId] = peer;
  };

  // --- TERMINER CONSULTATION ---
  const terminerConsultation = async () => {
    if (!user) return;
    if (!window.confirm("Terminer cette consultation ?")) return;

    try {
      await apiTerminerConsultation(rdvId, { compteRendu, ordonnance }, user.token);
      setStatus("termine");
      alert("Consultation terminée !");

      if (removeRDVFromList) removeRDVFromList(rdvId);
      if (removeRDVFromPatientList) removeRDVFromPatientList(rdvId);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde !");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] h-[85%] rounded-xl flex shadow-lg overflow-hidden">

        {/* Vidéo + Chat */}
        <div className="w-1/2 border-r flex flex-col">
          <div className="flex gap-2 p-2">
            <video ref={userVideo} muted autoPlay playsInline className="w-1/2 h-48 bg-black" />
            <div ref={remoteVideosRef} className="flex gap-2 flex-wrap"></div>
          </div>

          <div className="flex-1 flex flex-col border-t p-2">
            <div className="flex-1 overflow-y-auto space-y-1" ref={chatRef}>
              {messages.map((m, i) => (
                <div key={m.createdAt.toString() + i} className={m.senderId === user?._id ? "text-right" : "text-left"}>
                  <span className="bg-gray-200 px-2 py-1 rounded">{m.content}</span>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border rounded p-2"
                placeholder="Écrire un message..."
                disabled={status === "termine"}
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-green-600 text-white px-4 rounded hover:bg-green-700"
                disabled={status === "termine"}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>

        {/* Compte rendu + Ordonnance */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 border-b p-4 flex flex-col">
            <h2 className="font-bold mb-2">Compte rendu</h2>
            <textarea
              value={compteRendu}
              onChange={(e) => setCompteRendu(e.target.value)}
              className="flex-1 border rounded p-2 resize-none"
              placeholder="Rédiger le compte rendu médical..."
              disabled={role !== "medecin" || status === "termine"}
            />
          </div>

          <div className="flex-1 p-4 flex flex-col">
            <h2 className="font-bold mb-2">Ordonnance</h2>
            <textarea
              value={ordonnance}
              onChange={(e) => setOrdonnance(e.target.value)}
              className="flex-1 border rounded p-2 resize-none"
              placeholder="Rédiger l'ordonnance..."
              disabled={role !== "medecin" || status === "termine"}
            />
          </div>

          {role === "medecin" && (
            <button
              onClick={terminerConsultation}
              className="m-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={status === "termine"}
            >
              {status === "termine" ? "Consultation terminée" : "Terminer la consultation"}
            </button>
          )}
        </div>
      </div>

      <button onClick={onClose} className="absolute top-5 right-5 text-white text-2xl font-bold">✕</button>
    </div>
  );
}