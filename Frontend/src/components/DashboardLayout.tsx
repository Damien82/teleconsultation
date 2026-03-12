import { ReactNode, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaUser,
  FaUserMd,
  FaSignOutAlt,
  FaChevronDown,
  FaShieldAlt
} from "react-icons/fa";

type Props = {
  children: (active: string) => ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  const sidebarItems = [
    { label: "Accueil", icon: <FaHome size={19} />, key: "home" },
    { label: "Patients", icon: <FaUser size={18} />, key: "patients" },
    { label: "Médecins", icon: <FaUserMd size={19} />, key: "medecins" },
  ];

  return (
    // Fond Gris Perle Mat
    <div className="flex h-screen bg-[#F2F4F2] font-sans text-slate-700">
      
      {/* --- SIDEBAR BLANCHE ARRONDIE (Identique Patient/Médecin) --- */}
      <aside className="w-72 bg-white flex flex-col m-4 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Logo */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
            <FaShieldAlt size={18} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">AdminPanel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Gestion Système</p>
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                active === item.key 
                ? "bg-green-600 text-white shadow-md shadow-green-100" 
                : "text-slate-500 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <span className={`${active === item.key ? "text-white" : "text-slate-400 group-hover:text-green-600"}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-[14px]">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Badge Admin en bas */}
        <div className="p-4 m-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-xs">
                 AD
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                 <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider italic">Administrateur</p>
              </div>
           </div>
        </div>
      </aside>

      {/* --- ZONE DE CONTENU --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar Épurée */}
        <header className="h-20 flex justify-between items-center px-10">
          <h2 className="text-xl font-bold text-slate-800">
            {sidebarItems.find(i => i.key === active)?.label}
          </h2>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 bg-white p-1.5 pr-5 rounded-full border border-slate-200 hover:border-green-600/30 transition-all shadow-sm"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xs font-bold italic">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-sm font-bold text-slate-700">{user?.name}</span>
              <FaChevronDown className={`text-slate-400 text-[10px] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                  className="w-full text-left px-5 py-2.5 hover:bg-red-50 text-red-500 flex items-center gap-3 transition-colors text-sm font-semibold"
                  onClick={logout}
                >
                  <FaSignOutAlt className="opacity-70" /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content encapsulé dans le bloc blanc mat */}
        <main className="flex-1 px-6 pb-6 overflow-auto">
          <div className="bg-[#FBFCFB] h-full rounded-[3rem] border border-slate-200/60 p-10 shadow-sm overflow-auto">
            {children(active)}
          </div>
        </main>
      </div>
    </div>
  );
}