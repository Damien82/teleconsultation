// src/components/DashboardLayout.tsx
import { ReactNode, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaUser,
  FaUserMd,
  FaSignOutAlt,
  FaChevronDown,
  FaUserCircle
} from "react-icons/fa";

type Props = {
  children: (active: string) => ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("home");
 // const [dropdownOpen, setDropdownOpen] = useState(false);
    const [open, setOpen] = useState(false);

  const sidebarItems = [
    { label: "Accueil", icon: <FaHome />, key: "home" },
    { label: "Patients", icon: <FaUser />, key: "patients" },
    { label: "Médecins", icon: <FaUserMd />, key: "medecins" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-600 text-white flex flex-col">
        <div className="text-xl font-bold p-4 border-b border-green-500">
          Teleconsult Admin
        </div>
        <nav className="flex-1 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`flex items-center w-full p-2 mb-2 rounded hover:bg-green-500 transition ${
                active === item.key ? "bg-green-500" : ""
              }`}
              onClick={() => setActive(item.key)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
<header className="flex justify-between items-center bg-white shadow px-6 py-3">
  {/* Titre à gauche */}
  <h1 className="text-xl font-bold text-green-600">Dashboard Admin</h1>

  {/* Bouton profil à droite */}
  <div className="relative">
    <button
      className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded hover:bg-green-200 transition"
      onClick={() => setOpen(!open)}
    >
      <FaUserCircle className="text-green-600 text-2xl" />
      <span className="font-medium">{user?.name}</span>
      <FaChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
    </button>

    {open && (
      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
        <button
          className="w-full text-left px-4 py-2 hover:bg-green-100 flex items-center gap-2"
          onClick={() => alert("Page Profil")}
        >
          <FaUserCircle className="text-green-600 text-lg" /> Profil
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-green-100 flex items-center gap-2"
          onClick={logout}
        >
          <FaSignOutAlt className="text-green-600 text-lg" />
          Déconnexion
        </button>
      </div>
    )}
  </div>
</header>
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children(active)}</main>
      </div>
    </div>
  );
}
