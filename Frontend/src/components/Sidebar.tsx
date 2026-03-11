import { FaUser, FaUserMd, FaChartLine } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard/admin", icon: <FaChartLine /> },
    { name: "Patients", path: "/dashboard/admin/patients", icon: <FaUser /> },
    { name: "Médecins", path: "/dashboard/admin/medecins", icon: <FaUserMd /> },
  ];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">TeleConsult</h1>
      {links.map(link => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
              isActive ? "bg-blue-200 font-bold" : ""
            }`
          }
        >
          {link.icon} {link.name}
        </NavLink>
      ))}
    </div>
  );
}
