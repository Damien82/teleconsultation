// src/components/ConsultationChatModal.tsx
import { useEffect, useState, useRef } from "react";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";
import { apiTerminerConsultation } from "../services/api";

interface Props {
  rdvId: string;
  role: "patient" | "medecin";
  onClose: () => void;
  removeRDVFromList?: (rdvId: string) => void; // pour médecin
  removeRDVFromPatientList?: (rdvId: string) => void; // pour patient via socket
}

export default function ConsultationChatModal({
  rdvId,
  role,
  onClose,
  removeRDVFromList,
  removeRDVFromPatientList,
}: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [compteRendu, setCompteRendu] = useState("");
  const [ordonnance, setOrdonnance] = useState("");
  const [status, setStatus] = useState<"en_cours" | "termine">("en_cours");
  const chatRef = useRef<HTMLDivElement>(null);

  // Rejoindre la consultation via Socket
  useEffect(() => {
    socket.emit("join-consultation", { rdvId });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [rdvId]);

  // Scroll automatique
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Envoyer un message
  const sendMessage = () => {
    if (!text.trim() || status === "termine") return;

    const msg = {
      senderId: user?._id,
      senderRole: role,
      content: text,
      createdAt: new Date(),
    };

    socket.emit("send-message", { rdvId, message: msg });
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  // Terminer la consultation
  const terminerConsultation = async () => {
    if (!user) return;
    if (!confirm("Voulez-vous vraiment terminer cette consultation ?")) return;

    try {
      // 1️⃣ Appel API pour enregistrer compte rendu et ordonnance
      await apiTerminerConsultation(rdvId, { compteRendu, ordonnance }, user.token);

      // 2️⃣ Changer le status local
      setStatus("termine");
      alert("Consultation terminée !");

      // 3️⃣ Supprimer le RDV de la liste du médecin
      if (removeRDVFromList) removeRDVFromList(rdvId);

      // 4️⃣ Notifier le patient pour supprimer son RDV via Socket
      if (removeRDVFromPatientList) removeRDVFromPatientList(rdvId);
      else socket.emit("rdv-termine", { rdvId });

      // 5️⃣ Fermer le modal
      onClose();
    } catch (err) {
      console.error("Erreur terminer consultation :", err);
      alert("Erreur lors de la sauvegarde !");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] h-[85%] rounded-xl flex shadow-lg overflow-hidden">

        {/* CHAT */}
        <div className="w-1/2 border-r flex flex-col bg-green-50">
          <div className="p-4 font-bold border-b bg-green-200 text-green-900">
            Consultation
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2" ref={chatRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded max-w-[70%] break-words ${
                  m.senderRole === role
                    ? "bg-green-600 text-white self-end ml-auto"
                    : "bg-white border border-green-200 text-green-900 self-start"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="flex p-4 border-t">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border rounded p-2 focus:outline-green-500"
              placeholder="Écrire un message..."
              disabled={status === "termine"}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-green-600 text-white px-4 rounded hover:bg-green-700 transition"
              disabled={status === "termine"}
            >
              Envoyer
            </button>
          </div>
        </div>

        {/* DROITE : Compte rendu + Ordonnance */}
        <div className="w-1/2 flex flex-col">

          {/* Compte rendu */}
          <div className="flex-1 border-b p-4 flex flex-col bg-green-50">
            <h2 className="font-bold mb-2 text-green-800">Compte rendu</h2>
            <textarea
              value={compteRendu}
              onChange={(e) => setCompteRendu(e.target.value)}
              className="flex-1 border rounded p-2 resize-none focus:outline-green-500"
              placeholder="Rédiger le compte rendu médical..."
              disabled={role !== "medecin" || status === "termine"}
            />
          </div>

          {/* Ordonnance */}
          <div className="flex-1 p-4 flex flex-col bg-green-50">
            <h2 className="font-bold mb-2 text-green-800">Ordonnance</h2>
            <textarea
              value={ordonnance}
              onChange={(e) => setOrdonnance(e.target.value)}
              className="flex-1 border rounded p-2 resize-none focus:outline-green-500"
              placeholder="Rédiger l'ordonnance..."
              disabled={role !== "medecin" || status === "termine"}
            />
          </div>

          {/* Bouton terminer */}
          {role === "medecin" && (
            <button
              onClick={terminerConsultation}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded mx-4 mb-4 hover:bg-green-700 transition"
              disabled={status === "termine"}
            >
              {status === "termine" ? "Consultation terminée" : "Terminer la consultation"}
            </button>
          )}

        </div>
      </div>

      {/* Bouton fermer modal */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-2xl font-bold"
      >
        ✕
      </button>
    </div>
  );
}
