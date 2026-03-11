// src/components/patient/PrendreRDVTable.tsx
type Props = {
  medecins: any[];
  medecinId: string;
  setMedecinId: (id: string) => void;
  date: string;
  setDate: (d: string) => void;
  prendreRDV: () => Promise<void>; // fonction async
};

export default function PrendreRDVTable({
  medecins,
  medecinId,
  setMedecinId,
  date,
  setDate,
  prendreRDV,
}: Props) {
  const handleClick = async () => {
    await prendreRDV();        // envoie le RDV comme d’habitude
    alert("Rendez-vous envoyé !"); // popup pour signaler que c’est bon
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="font-bold text-green-700 mb-2">Prendre un rendez-vous</h3>
      <select
        className="border p-2 mb-2 w-full rounded"
        onChange={(e) => setMedecinId(e.target.value)}
        value={medecinId}
      >
        <option value="">Choisir un médecin</option>
        {medecins.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>
      <input
        type="datetime-local"
        className="border p-2 mb-2 w-full rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition"
        onClick={handleClick} // utilise handleClick
      >
        Payer & Prendre RDV
      </button>
    </div>
  );
}
