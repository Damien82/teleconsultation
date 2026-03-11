import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-lg font-semibold">Tableau de bord</h1>
      <div className="flex items-center gap-4">
        <FaBell className="text-xl cursor-pointer" />
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle className="text-2xl" />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}
