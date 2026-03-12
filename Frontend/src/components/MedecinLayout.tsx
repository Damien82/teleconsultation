import { ReactNode, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaChevronDown, FaCalendarAlt, FaHome, FaHistory } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

type ActiveTab = "home" | "mesRDV" | "historique";

type Props = {
  children: ReactNode;
  activeTab: ActiveTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
};

export default function MedecinLayout({ children, activeTab, setActiveTab }: Props) {
  const { user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);

  const navItems = [
    { name: "Tableau de bord", path: "home", icon: <FaHome size={19} /> },
    { name: "Mes rendez-vous", path: "mesRDV", icon: <FaCalendarAlt size={17} /> },
    { name: "Historique", path: "historique", icon: <FaHistory size={17} /> },
  ];

  return (
    // Fond : Gris très léger et mat (réduit l'éclat du blanc)
    <div className="flex h-screen bg-[#F2F4F2] font-sans text-slate-700">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white flex flex-col m-4 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Logo avec ton Vert d'origine */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-100">
            T
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">TeleConsult</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Espace Praticien</p>
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.path as ActiveTab)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                activeTab === item.path 
                ? "bg-green-600 text-white shadow-md shadow-green-100" 
                : "text-slate-500 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <span className={activeTab === item.path ? "text-white" : "text-slate-400 transition-colors"}>
                {item.icon}
              </span>
              <span className="font-semibold text-[14px]">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Profil Section Bas */}
        <div className="p-4 m-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                 {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                 <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Médecin</p>
              </div>
           </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR */}
        <header className="h-20 flex justify-between items-center px-10">
          <h2 className="text-xl font-bold text-slate-800">
            {navItems.find(n => n.path === activeTab)?.name}
          </h2>

          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-3 bg-white p-1.5 pr-5 rounded-full border border-slate-200 hover:border-green-600/30 transition-all shadow-sm"
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-sm font-bold text-slate-700">{user?.name.split(' ')[0]}</span>
              <FaChevronDown className={`text-slate-400 text-[10px] transition-transform ${openDropdown ? "rotate-180" : ""}`} />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
                <button
                  className="w-full text-left px-5 py-2 hover:bg-red-50 text-red-500 flex items-center gap-3 transition-colors text-sm font-semibold"
                  onClick={logout}
                >
                  <FaSignOutAlt /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ZONE DE CONTENU : BLANC CASSÉ MAT */}
        <main className="flex-1 px-6 pb-6 overflow-auto">
          {/* bg-[#FBFCFB] est un blanc très légèrement teinté de vert/gris, très reposant */}
          <div className="bg-[#FBFCFB] h-full rounded-[3rem] border border-slate-200/60 p-10 shadow-sm overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}