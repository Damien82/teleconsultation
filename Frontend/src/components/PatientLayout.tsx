import { ReactNode, useState } from "react";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
  FaCalendarAlt,
  FaHome,
  FaPlus,
  FaHistory,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: ReactNode;
  activeTab: "home" | "prendre" | "mesRDV" | "historique";
  setActiveTab: (tab: "home" | "prendre" | "mesRDV" | "historique") => void;
};

export default function PatientLayout({ children, activeTab, setActiveTab }: Props) {
  const { user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);

  const navItems = [
    { name: "Accueil", icon: <FaHome size={19} />, tab: "home" },
    { name: "Prendre RDV", icon: <FaPlus size={17} />, tab: "prendre" },
    { name: "Mes RDV", icon: <FaCalendarAlt size={17} />, tab: "mesRDV" },
    { name: "Historique", icon: <FaHistory size={17} />, tab: "historique" },
  ];

  return (
    // Fond : Gris mat doux pour faire ressortir les blocs blancs
    <div className="flex h-screen bg-[#F2F4F2] font-sans text-slate-700">
      
      {/* --- SIDEBAR PATIENT --- */}
      <aside className="w-72 bg-white flex flex-col m-4 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Logo */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-100 italic">
            T
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">TeleConsult</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Espace Patient</p>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.tab as any)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === item.tab 
                ? "bg-green-600 text-white shadow-md shadow-green-100" 
                : "text-slate-500 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <span className={`${activeTab === item.tab ? "text-white" : "text-slate-400 group-hover:text-green-600"}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-[14px]">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Profil Section Bas - Plus accueillant pour un patient */}
        <div className="p-4 m-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                 {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                 <p className="text-[10px] text-slate-400 font-medium italic">Compte Patient</p>
              </div>
           </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR ÉPURÉE */}
        <header className="h-20 flex justify-between items-center px-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {navItems.find(n => n.tab === activeTab)?.name}
            </h2>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-3 bg-white p-1.5 pr-5 rounded-full border border-slate-200 hover:border-green-600/30 transition-all shadow-sm"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xs font-bold">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-sm font-bold text-slate-700">{user?.name.split(' ')[0]}</span>
              <FaChevronDown className={`text-slate-400 text-[10px] transition-transform ${openDropdown ? "rotate-180" : ""}`} />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-150">
                <button
                  className="w-full text-left px-5 py-2 hover:bg-red-50 text-red-500 flex items-center gap-3 transition-colors text-sm font-semibold"
                  onClick={logout}
                >
                  <FaSignOutAlt className="opacity-70" /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ZONE DE CONTENU : BLANC CASSÉ MAT */}
        <main className="flex-1 px-6 pb-6 overflow-auto">
          <div className="bg-[#FBFCFB] h-full rounded-[3rem] border border-slate-200/60 p-10 shadow-sm overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}