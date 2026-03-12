import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";
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

  // ===============================
  // INIT CAMERA + SOCKET
  // ===============================

  useEffect(() => {
    let localStream: MediaStream;

    const init = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(localStream);

        if (userVideo.current) {
          userVideo.current.srcObject = localStream;
        }

        socket.current = io("https://teleconsultation-m2ii.onrender.com", {
          withCredentials: true,
        });

        socket.current.emit("join-consultation", {
          rdvId,
          userId: user?._id,
          role,
        });

        // CHAT
        socket.current.on("receive-message", (msg: Message) => {
          setMessages((prev) => [...prev, msg]);
        });

        // USER CONNECTED
        socket.current.on(
          "user-connected",
          ({ socketId, role: remoteRole }: { socketId: string; role: "patient" | "medecin" }) => {
            if (!localStream) return;

            const initiator = role === "medecin";

            if (
              (role === "medecin" && remoteRole === "patient") ||
              (role === "patient" && remoteRole === "medecin")
            ) {
              if (!peersRef.current[socketId]) {
                createPeer(socketId, initiator, localStream);
              }
            }
          }
        );

        // SIGNAL WEBRTC
        socket.current.on(
          "webrtc-signal",
          ({ signal, from }: { signal: Peer.SignalData; from: string }) => {
            let peer = peersRef.current[from];

            if (!peer && localStream) {
              peer = createPeer(from, false, localStream);
            }

            peer?.signal(signal);
          }
        );
      } catch (err) {
        console.error("Erreur caméra/micro :", err);
      }
    };

    init();

    return () => {
      Object.values(peersRef.current).forEach((peer) => peer.destroy());

      if (socket.current) socket.current.disconnect();

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [rdvId, role, user?._id]);

  // ===============================
  // SCROLL CHAT AUTO
  // ===============================

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // ===============================
  // CREATE PEER
  // ===============================

  const createPeer = (
    remoteSocketId: string,
    initiator: boolean,
    localStream: MediaStream
  ) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: localStream,
    });

    peer.on("signal", (signalData) => {
      socket.current?.emit("webrtc-signal", {
        roomId: `consult-${rdvId}`,
        signal: signalData,
        from: socket.current?.id,
        to: remoteSocketId,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (!remoteVideosRef.current) return;

      const video = document.createElement("video");

      video.srcObject = remoteStream;
      video.autoplay = true;
      video.playsInline = true;
      video.className = "w-1/2 h-48 bg-black rounded";

      remoteVideosRef.current.innerHTML = "";
      remoteVideosRef.current.appendChild(video);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peersRef.current[remoteSocketId] = peer;

    return peer;
  };

  // ===============================
  // SEND MESSAGE
  // ===============================

  const sendMessage = () => {
    if (!text.trim() || status === "termine") return;

    const msg: Message = {
      senderId: user?._id || "",
      senderRole: role,
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, msg]);

    socket.current?.emit("send-message", {
      roomId: `consult-${rdvId}`,
      message: msg,
    });

    setText("");
  };

  // ===============================
  // TERMINER CONSULTATION
  // ===============================

  const terminerConsultation = async () => {
    if (!user) return;

    if (!window.confirm("Terminer cette consultation ?")) return;

    try {
      await apiTerminerConsultation(
        rdvId,
        { compteRendu, ordonnance },
        user.token
      );

      setStatus("termine");

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

        {/* VIDEO + CHAT */}
        <div className="w-1/2 border-r flex flex-col">

          <div className="flex gap-2 p-2">
            <video
              ref={userVideo}
              muted
              autoPlay
              playsInline
              className="w-1/2 h-48 bg-black rounded"
            />
            <div
              ref={remoteVideosRef}
              className="flex gap-2 flex-wrap w-1/2"
            ></div>
          </div>

          {/* CHAT */}
          <div className="flex-1 flex flex-col border-t p-2 bg-gray-50">

            <div
              className="flex-1 overflow-y-auto p-2 space-y-2"
              ref={chatRef}
            >
              {messages.map((m, i) => {
                const isMe = m.senderId === user?._id;

                return (
                  <div
                    key={m.createdAt.toString() + i}
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-xl break-words
                        ${
                          isMe
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-800 shadow"
                        }`}
                    >
                      <div className="text-sm">{m.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex mt-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border p-2 rounded-l"
                placeholder="Écrire un message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />

              <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-4 rounded-r"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>

        {/* COMPTE RENDU */}
        <div className="w-1/2 flex flex-col">

          <div className="flex-1 border-b p-4 flex flex-col">
            <h2 className="font-bold mb-2">Compte rendu</h2>
            <textarea
              value={compteRendu}
              onChange={(e) => setCompteRendu(e.target.value)}
              className="flex-1 border rounded p-2"
              disabled={role !== "medecin" || status === "termine"}
            />
          </div>

          <div className="flex-1 p-4 flex flex-col">
            <h2 className="font-bold mb-2">Ordonnance</h2>
            <textarea
              value={ordonnance}
              onChange={(e) => setOrdonnance(e.target.value)}
              className="flex-1 border rounded p-2"
              disabled={role !== "medecin" || status === "termine"}
            />
          </div>

          {role === "medecin" && (
            <button
              onClick={terminerConsultation}
              className="m-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Terminer la consultation
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-2xl font-bold"
      >
        ✕
      </button>
    </div>
  );
}