import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <Link to="/" className="font-bold text-xl">TeleConsult</Link>
            <div className="space-x-4">
                <Link to="/">Accueil</Link>
                {user && <Link to="/dashboard">Dashboard</Link>}
            </div>
        </nav>
    )
}
