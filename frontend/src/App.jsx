import { Link } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import Dashboard from "./pages/Dashboard";
import Applicants from "./pages/Applicants";

// Role ke hisaab se sahi page par bhejta hai
function Home() {
  const { role } = useAuth();
  return <Navigate to={role === "STUDENT" ? "/jobs" : "/dashboard"} replace />;
}

function NotFound() {
  return (
    <div className="login-wrap">
      <div className="login-card center">
        <h1>404</h1>
        <p className="muted">This page does not exist.</p>
        <Link className="btn" to="/">
          Go home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute roles={["STUDENT"]} />}>
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/applications" element={<MyApplications />} />
          </Route>

          <Route element={<ProtectedRoute roles={["RECRUITER", "ADMIN"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs/:id/applicants" element={<Applicants />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}