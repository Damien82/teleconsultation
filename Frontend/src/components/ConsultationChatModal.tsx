import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiTerminerConsultation, apiGetAgoraToken } from "../services/api";
import io, { Socket } from "socket.io-client";

// --- AGORA IMPORTS ---
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRTCClient,
} from "agora-rtc-react";

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

// Composant Principal avec Provider
export default function ConsultationModalAgora(props: Props) {
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <AgoraRTCProvider client={client}>
      <ConsultationContent {...props} />
    </AgoraRTCProvider>
  );
}

// Sous-composant gérant la logique interne
function ConsultationContent({
  rdvId,
  role,
  onClose,
  removeRDVFromList,
  removeRDVFromPatientList,
}: Props) {
  const { user } = useAuth();
  
  // États Chat & Médical
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [compteRendu, setCompteRendu] = useState("");
  const [ordonnance, setOrdonnance] = useState("");
  const [status, setStatus] = useState<"en_cours" | "termine">("en_cours");

  // États Agora
  const [activeCall, setActiveCall] = useState(false);
  const [agoraConfig, setAgoraConfig] = useState<{ appId: string; token: string; channel: string } | null>(null);
  const [joinEnabled, setJoinEnabled] = useState(role === "medecin");

  const chatRef = useRef<HTMLDivElement>(null);
  const socket = useRef<Socket | null>(null);

  // --- LOGIQUE AGORA (Hooks) ---
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(activeCall);
  const { localCameraTrack } = useLocalCameraTrack(activeCall);
  
  // Rejoindre le canal quand agoraConfig est prêt et activeCall est true
  useJoin({
    appid: agoraConfig?.appId || "",
    channel: agoraConfig?.channel || "",
    token: agoraConfig?.token || null,
  }, activeCall && !!agoraConfig);

  // Publier Micro et Caméra
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Liste des utilisateurs distants
  const remoteUsers = useRemoteUsers();

  // --- SOCKET INIT ---
  useEffect(() => {
    socket.current = io("https://teleconsultation-m2ii.onrender.com", { withCredentials: true });
    socket.current.emit("join-consultation", { rdvId, userId: user?._id, role });

    socket.current.on("receive-message", (msg: Message) => setMessages(prev => [...prev, msg]));
    socket.current.on("medecin-joined", () => {
      if (role === "patient") setJoinEnabled(true);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [rdvId, role, user?._id]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // --- ACTIONS ---
  const joinCall = async () => {
    if (!user) return;
    try {
      const data = await apiGetAgoraToken(rdvId, user._id);
      setAgoraConfig(data);
      setActiveCall(true);
      if (role === "medecin") socket.current?.emit("medecin-joined", { rdvId });
    } catch (err) {
      console.error("Erreur récupération token Agora:", err);
      alert("Impossible de démarrer l'appel.");
    }
  };

  const sendMessage = () => {
    if (!text.trim() || status === "termine") return;
    const msg: Message = { senderId: user?._id || "", senderRole: role, content: text, createdAt: new Date() };
    setMessages(prev => [...prev, msg]);
    socket.current?.emit("send-message", { roomId: `consult-${rdvId}`, message: msg });
    setText("");
  };

  const terminerConsultation = async () => {
    if (!user) return;
    if (!window.confirm("Terminer cette consultation ?")) return;

    try {
      await apiTerminerConsultation(rdvId, { compteRendu, ordonnance }, user.token);
      setStatus("termine");
      setActiveCall(false); // Coupe la vidéo
      
      if (removeRDVFromList) removeRDVFromList(rdvId);
      if (removeRDVFromPatientList) removeRDVFromPatientList(rdvId);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la clôture.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl flex shadow-2xl overflow-hidden relative">
        
        {/* COLONNE GAUCHE : VIDÉO + CHAT */}
        <div className="w-full md:w-1/2 border-r flex flex-col bg-gray-50">
          
          {/* ZONE VIDÉO */}
          <div className="h-64 bg-slate-900 p-2 flex gap-2 relative">
            {!activeCall ? (
              <div className="flex-1 flex flex-col items-center justify-center text-white space-y-4">
                <p className="text-sm opacity-70">La vidéo n'est pas activée</p>
                <button
                  onClick={joinCall}
                  disabled={!joinEnabled}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    joinEnabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {role === "patient" && !joinEnabled ? "En attente du médecin..." : "Rejoindre l'appel"}
                </button>
              </div>
            ) : (
              <>
                {/* Vidéo Locale */}
                <div className="flex-1 rounded-lg overflow-hidden bg-black border border-gray-700 relative">
                  <LocalVideoTrack track={localCameraTrack} play className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white">Vous</div>
                </div>
                
                {/* Vidéos Distantes */}
                {remoteUsers.map((u) => (
                  <div key={u.uid} className="flex-1 rounded-lg overflow-hidden bg-black border border-gray-700 relative">
                    <RemoteUser user={u} playVideo playAudio className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white">
                      {role === "medecin" ? "Patient" : "Médecin"}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* CHAT */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => {
                const isMe = m.senderId === user?._id;
                return (
                  <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                      isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"
                    }`}>
                      <p className="text-sm">{m.content}</p>
                      <p className={`text-[9px] mt-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Message..."
                disabled={status === "termine"}
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={status === "termine"}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 disabled:opacity-50"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : DOSSIER MÉDICAL */}
        <div className="hidden md:flex w-1/2 flex-col bg-white">
          <div className="p-6 flex-1 flex flex-col space-y-6 overflow-y-auto">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Compte-rendu de consultation</h2>
              <textarea
                value={compteRendu}
                onChange={(e) => setCompteRendu(e.target.value)}
                disabled={role !== "medecin" || status === "termine"}
                className="w-full h-48 p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none bg-gray-50 disabled:bg-white"
                placeholder={role === "medecin" ? "Détails de l'examen..." : "Le médecin rédige le compte-rendu..."}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Ordonnance</h2>
              <textarea
                value={ordonnance}
                onChange={(e) => setOrdonnance(e.target.value)}
                disabled={role !== "medecin" || status === "termine"}
                className="w-full h-48 p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none bg-gray-50 disabled:bg-white"
                placeholder={role === "medecin" ? "Médicaments et posologie..." : "L'ordonnance s'affichera ici..."}
              />
            </div>
          </div>

          {role === "medecin" && (
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={terminerConsultation}
                disabled={status === "termine"}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg disabled:bg-gray-400"
              >
                {status === "termine" ? "Consultation Clôturée" : "Terminer et Enregistrer"}
              </button>
            </div>
          )}
        </div>

        {/* BOUTON FERMER */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-2xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}