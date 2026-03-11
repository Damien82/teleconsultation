import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { apiLogin } from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await apiLogin({ email, password });
      login(user);
      if (user.role === "admin") navigate("/dashboard/admin");
      if (user.role === "medecin") navigate("/dashboard/medecin");
      if (user.role === "patient") navigate("/dashboard/patient");
    } catch (err: any) {
      alert(err.response?.data?.message || "Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-96 space-y-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Connexion</h2>

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Mot de passe */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <span
            className="absolute top-3 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="bg-green-600 text-white w-full py-2 rounded-xl hover:bg-green-700 transition font-semibold">
          Se connecter
        </button>

        <p className="text-center text-gray-600">
          Pas encore de compte ?{" "}
          <span
            className="text-green-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Créez-en un
          </span>
        </p>
      </form>
    </div>
  );
}
