import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer, { SignalData } from "simple-peer";
import { useAuth } from "../context/AuthContext";
import { apiTerminerConsultation } from "../services/api";

interface Props {
  rdvId: string;
  role: "patient" | "medecin";
  onClose: () => void;
  removeRDVFromList?: (rdvId: string) => void;
  removeRDVFromPatientList?: (rdvId: string) => void;
}

interface Message {
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: Date;
}

export default function ConsultationModal({ rdvId, role, onClose }: Props) {
  const { user } = useAuth();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState<SignalData | null>(null);
  const [callerId, setCallerId] = useState<string>("");
  const [patientSocketId, setPatientSocketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [compteRendu, setCompteRendu] = useState("");
  const [ordonnance, setOrdonnance] = useState("");
  const [status, setStatus] = useState<"en_cours" | "termine">("en_cours");

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);
  const socket = useRef<any>(null);

  // INITIALISATION CAMERA + SOCKET
  useEffect(() => {
    // Accès caméra + micro
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) userVideo.current.srcObject = currentStream;
      });

    // Connexion socket
    socket.current = io("https://teleconsultation-m2ii.onrender.com", { withCredentials: true });

    // Rejoindre la salle
    socket.current.emit("join-consultation", { rdvId, userId: user?._id, role });

    // Listeners socket
    socket.current.on("receive-message", (msg: Message) => setMessages((prev) => [...prev, msg]));

    socket.current.on("receive-call", (data: { from: string; signal: SignalData }) => {
      setReceivingCall(true);
      setCallerSignal(data.signal);
      setCallerId(data.from);
    });

    // Le patient est connecté → Médecin récupère son socketId
    socket.current.on("patient-connected", ({ patientSocketId }: { patientSocketId: string }) => {
      if (role === "medecin") setPatientSocketId(patientSocketId);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [rdvId, role, user?._id]);

  // Scroll auto chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // ENVOYER MESSAGE
  const sendMessage = () => {
    if (!text.trim() || status === "termine") return;
    const msg: Message = { senderId: user?._id || "", senderRole: role, content: text, createdAt: new Date() };
    setMessages((prev) => [...prev, msg]);
    socket.current.emit("send-message", { rdvId, message: msg });
    setText("");
  };

  // MÉDECIN → APPELER PATIENT
  const callPatient = () => {
    if (!stream || !patientSocketId) return;

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signalData: SignalData) => {
      socket.current.emit("call-user", { rdvId, targetSocketId: patientSocketId, signalData });
    });

    peer.on("stream", (remoteStream: MediaStream) => {
      if (partnerVideo.current) partnerVideo.current.srcObject = remoteStream;
    });

    socket.current.on("call-accepted", (signal: SignalData) => peer.signal(signal));

    connectionRef.current = peer;
  };

  // PATIENT → REPONDRE APPEL
  const answerCall = () => {
    if (!stream || !callerSignal) return;

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal: SignalData) => {
      socket.current.emit("answer-call", { toSocketId: callerId, signal });
    });

    peer.on("stream", (remoteStream: MediaStream) => {
      if (partnerVideo.current) partnerVideo.current.srcObject = remoteStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
    setReceivingCall(false);
  };

  // TERMINER CONSULTATION
  const terminerConsultation = async () => {
    if (!user) return;
    if (!confirm("Terminer cette consultation ?")) return;
    try {
      await apiTerminerConsultation(rdvId, { compteRendu, ordonnance }, user.token);
      setStatus("termine");
      alert("Consultation terminée !");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde !");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] h-[85%] rounded-xl flex shadow-lg overflow-hidden">
        {/* GAUCHE : Vidéo + Chat */}
        <div className="w-1/2 border-r flex flex-col">
          <div className="flex gap-2 p-2">
            <video ref={userVideo} muted autoPlay playsInline className="w-1/2 h-48 bg-black" />
            <video ref={partnerVideo} autoPlay playsInline className="w-1/2 h-48 bg-black" />
          </div>

          {role === "medecin" && (
            <button
              onClick={callPatient}
              disabled={!stream || !patientSocketId}
              className={`m-2 px-4 py-2 rounded text-white ${
                !stream || !patientSocketId ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Appeler le patient
            </button>
          )}

          {receivingCall && (
            <button onClick={answerCall} className="m-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Répondre à l'appel
            </button>
          )}

          {/* Chat */}
          <div className="flex-1 flex flex-col border-t p-2">
            <div className="flex-1 overflow-y-auto space-y-1" ref={chatRef}>
              {messages.map((m, i) => (
                <div key={i} className={m.senderId === user?._id ? "text-right" : "text-left"}>
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
                className="ml-2 bg-green-600 text-white px-4 rounded hover:bg-blue-700"
                disabled={status === "termine"}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>

        {/* DROITE : Compte rendu + Ordonnance */}
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