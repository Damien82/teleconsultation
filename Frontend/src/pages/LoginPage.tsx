import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { apiLogin } from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Ajout d'un état de chargement
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await apiLogin({ email, password });
      login(user);
      if (user.role === "admin") navigate("/dashboard/admin");
      else if (user.role === "medecin") navigate("/dashboard/medecin");
      else if (user.role === "patient") navigate("/dashboard/patient");
    } catch (err: any) {
      alert(err.response?.data?.message || "Email ou mot de passe incorrect.");
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
        
        {/* Côté gauche : Design & Message */}
        <div className="hidden md:flex md:w-1/2 bg-green-600 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150">
              <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.4,90,-16.2,88.5,-0.9C86.9,14.4,81.3,28.8,72.4,41.2C63.5,53.6,51.3,64,37.5,71.2C23.7,78.3,8.2,82.3,-7.4,81C-23,79.7,-38.7,73.1,-51.1,63.2C-63.4,53.3,-72.4,40.1,-77.8,25.6C-83.2,11.1,-85,-4.7,-81.8,-19.5C-78.6,-34.3,-70.5,-48.1,-58.5,-56C-46.5,-63.9,-30.7,-65.9,-16.6,-73.1C-2.5,-80.3,10.6,-83.5,24.1,-82.7C37.6,-81.9,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 italic">Teleconsult.</h1>
            <p className="text-green-100 text-lg">Retrouvez votre espace santé personnalisé et gérez vos rendez-vous en quelques secondes.</p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <p className="text-sm italic font-light italic">"Une interface simple qui me permet de rester concentré sur l'essentiel : ma santé."</p>
            <p className="text-sm font-bold mt-2">— Patient satisfait</p>
          </div>
        </div>

        {/* Côté droit : Le Formulaire */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">Bon retour !</h2>
            <p className="text-gray-500 mt-2">Connectez-vous pour accéder à votre espace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email professionnel ou personnel</label>
              <div className="relative group">
                <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
                <span className="text-xs text-green-600 hover:underline cursor-pointer">Oublié ?</span>
              </div>
              <div className="relative group">
                <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-green-200"
              }`}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Nouveau sur la plateforme ?{" "}
              <button
                className="text-green-600 font-bold hover:underline"
                onClick={() => navigate("/register")}
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}