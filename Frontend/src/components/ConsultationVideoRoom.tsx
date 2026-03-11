// src/components/ConsultationVideoRoom.tsx
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface Props {
  rdvId: string;
  role: "patient" | "medecin";
}

const socket = io("http://localhost:5000");

export default function ConsultationVideoRoom({ rdvId, role }: Props) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const [started, setStarted] = useState(false);

  const startWebRTC = async () => {
    setStarted(true);
  };

useEffect(() => {
  pcRef.current = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  })

  pcRef.current.ontrack = (event) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0]
    }
  }

  pcRef.current.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        rdvId,
        candidate: event.candidate
      })
    }
  }

  return () => {
    pcRef.current?.close()
  }
}, [])

useEffect(() => {
  const startMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }

    stream.getTracks().forEach(track => {
      pcRef.current?.addTrack(track, stream)
    })
  }

  startMedia()
}, [])

socket.on("ready-for-offer", async () => {
  if (!pcRef.current) return

  if (pcRef.current.signalingState !== "stable") return

  const offer = await pcRef.current.createOffer()
  await pcRef.current.setLocalDescription(offer)

  socket.emit("offer", {
    rdvId,
    offer
  })
})

socket.on("ready-for-offer", async () => {
  if (!pcRef.current) return

  if (pcRef.current.signalingState !== "stable") return

  const offer = await pcRef.current.createOffer()
  await pcRef.current.setLocalDescription(offer)

  socket.emit("offer", {
    rdvId,
    offer
  })
})


socket.on("offer", async ({ offer }) => {
  if (!pcRef.current) return

  if (pcRef.current.signalingState !== "stable") return

  await pcRef.current.setRemoteDescription(offer)

  const answer = await pcRef.current.createAnswer()
  await pcRef.current.setLocalDescription(answer)

  socket.emit("answer", {
    rdvId,
    answer
  })
})

socket.on("answer", async ({ answer }) => {
  if (!pcRef.current) return

  if (pcRef.current.signalingState !== "have-local-offer") return

  await pcRef.current.setRemoteDescription(answer)
})

socket.on("ice-candidate", async ({ candidate }) => {
  if (!pcRef.current) return
  if (!pcRef.current.remoteDescription) return

  try {
    await pcRef.current.addIceCandidate(candidate)
  } catch (err) {
    console.error("ICE error", err)
  }
})



  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {!started && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={startWebRTC}
        >
          Rejoindre la consultation
        </button>
      )}
      {started && (
        <div className="flex w-full h-full">
          <video ref={localVideoRef} autoPlay muted className="w-1/2 border" />
          <video ref={remoteVideoRef} autoPlay className="w-1/2 border" />
        </div>
      )}
    </div>
  );
}
