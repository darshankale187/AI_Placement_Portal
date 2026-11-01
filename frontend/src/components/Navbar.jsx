import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const links = {
    STUDENT: [
        { to: "/jobs", label: "Jobs" },
        { to: "/applications", label: "My applications" },
    ],
    RECRUITER: [{ to: "/dashboard", label: "Dashboard" }],
    ADMIN: [{ to: "/dashboard", label: "Dashboard" }],
};

export default function Navbar() {
    const { name, role, logout } = useAuth();
    const { theme, toggle } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <span className="brand">PlacementHub</span>

            <div className="nav-links">
                {(links[role] || []).map((l) => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    >
                        {l.label}
                    </NavLink>
                ))}
            </div>

            <div className="nav-right">
                <button className="btn btn-ghost btn-sm" onClick={toggle}>
                    {theme === "light" ? "Dark" : "Light"} mode
                </button>
                <span className="user-chip">
                    {name} ({role})
                </span>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}