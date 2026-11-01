import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// roles diye hon to sirf wahi role andar aa sakta hai, baaki ko home par bhej dete hain
export default function ProtectedRoute({ roles }) {
    const { user, role } = useAuth();
    const location = useLocation();

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
    return <Outlet />;
}