import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowLeft, FaStethoscope } from "react-icons/fa";
import { apiRegister } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiRegister(form);
      alert("Inscription réussie !");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      {/* Bouton retour accueil */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-green-600 transition font-medium"
      >
        <FaArrowLeft /> Retour à l'accueil
      </button>

      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Côté gauche : Identique au Login */}
        <div className="hidden md:flex md:w-1/2 bg-green-600 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150">
              <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.4,90,-16.2,88.5,-0.9C86.9,14.4,81.3,28.8,72.4,41.2C63.5,53.6,51.3,64,37.5,71.2C23.7,78.3,8.2,82.3,-7.4,81C-23,79.7,-38.7,73.1,-51.1,63.2C-63.4,53.3,-72.4,40.1,-77.8,25.6C-83.2,11.1,-85,-4.7,-81.8,-19.5C-78.6,-34.3,-70.5,-48.1,-58.5,-56C-46.5,-63.9,-30.7,-65.9,-16.6,-73.1C-2.5,-80.3,10.6,-83.5,24.1,-82.7C37.6,-81.9,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 italic">Teleconsult.</h1>
            <p className="text-green-100 text-lg">Créez votre compte en quelques instants et accédez à une nouvelle expérience de soin.</p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <p className="text-sm italic font-light">"Rejoignez notre réseau de santé et bénéficiez d'un suivi médical simplifié."</p>
            <p className="text-sm font-bold mt-2">— L'équipe HealthConnect</p>
          </div>
        </div>

        {/* Côté droit : Formulaire d'inscription */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">Créer un compte !</h2>
            <p className="text-gray-500 mt-2">Inscrivez-vous pour commencer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nom complet */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Nom complet</label>
              <div className="relative group">
                <FaUser className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Jean Dupont"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="nom@exemple.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Mot de passe</label>
              <div className="relative group">
                <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>


            <button 
              disabled={isLoading}
              className={`w-full mt-4 py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-green-200"
              }`}
            >
              {isLoading ? "Création du compte..." : "S'inscrire"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Déjà un compte ?{" "}
              <button
                className="text-green-600 font-bold hover:underline"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}