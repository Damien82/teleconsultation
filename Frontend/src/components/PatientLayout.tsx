// src/components/PatientLayout.tsx
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
    { name: "Accueil", icon: <FaHome />, tab: "home" },
    { name: "Prendre RDV", icon: <FaPlus />, tab: "prendre" },
    { name: "Mes RDV", icon: <FaCalendarAlt />, tab: "mesRDV" },
    { name: "Historique", icon: <FaHistory />, tab: "historique" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-600 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold text-white">TeleConsult</div>
        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`flex items-center gap-3 p-3 rounded mb-2 w-full text-left hover:bg-green-500 transition ${
                activeTab === item.tab ? "bg-green-700" : ""
              }`}
              onClick={() => setActiveTab(item.tab as any)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-end items-center bg-white shadow px-6 py-3">
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded hover:bg-green-200 transition"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              <FaUserCircle className="text-green-600 text-2xl" />
              <span className="font-medium">{user?.name}</span>
              <FaChevronDown className={`transition-transform ${openDropdown ? "rotate-180" : ""}`} />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-green-100 flex items-center gap-2"
                  onClick={logout}
                >
                  <FaSignOutAlt className="text-green-600" /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
