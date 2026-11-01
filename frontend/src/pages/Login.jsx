import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui";

export default function Login() {
    const { user, login, register } = useAuth();
    const location = useLocation();
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({ fullName: "", role: "STUDENT", username: "", password: "" });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const from = location.state?.from?.pathname || "/";

    if (user) return <Navigate to={from} replace />;

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            if (mode === "login") await login(form.username, form.password);
            else await register(form);
        } catch (err) {
            setError(err.message || "Something went wrong");
        }
        setBusy(false);
    };

    return (
        <div className="login-wrap">
            <form className="login-card" onSubmit={submit}>
                <h1>PlacementHub</h1>
                <p className="muted">{mode === "login" ? "Sign in to continue" : "Create your account"}</p>

                {error && <Alert>{error}</Alert>}

                {mode === "register" && (
                    <>
                        <div className="field">
                            <label>Full name</label>
                            <input value={form.fullName} onChange={set("fullName")} />
                        </div>
                        <div className="field">
                            <label>I am a</label>
                            <select value={form.role} onChange={set("role")}>
                                <option value="STUDENT">Student</option>
                                <option value="RECRUITER">Recruiter</option>
                            </select>
                        </div>
                    </>
                )}

                <div className="field">
                    <label>Username</label>
                    <input value={form.username} onChange={set("username")} />
                </div>

                <div className="field">
                    <label>Password</label>
                    <input type="password" value={form.password} onChange={set("password")} />
                </div>

                <button className="btn btn-block" type="submit" disabled={busy}>
                    {busy ? "Please wait..." : mode === "login" ? "Login" : "Register"}
                </button>

                <p className="hint">
                    {mode === "login" ? "New here? " : "Already have an account? "}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setError("");
                            setMode(mode === "login" ? "register" : "login");
                        }}
                    >
                        {mode === "login" ? "Create account" : "Login"}
                    </a>
                </p>
            </form>
        </div>
    );
}