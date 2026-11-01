import { createContext, useContext, useState } from "react";
import { postJson } from "../api";

const AuthContext = createContext(null);
const KEYS = ["placement_token", "placement_user", "placement_name", "placement_role"];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => localStorage.getItem("placement_user"));
    const [name, setName] = useState(() => localStorage.getItem("placement_name"));
    const [role, setRole] = useState(() => localStorage.getItem("placement_role"));

    const authenticate = async (path, body) => {
        const data = await postJson(path, body);
        localStorage.setItem("placement_token", data.token);
        localStorage.setItem("placement_user", data.username);
        localStorage.setItem("placement_name", data.fullName);
        localStorage.setItem("placement_role", data.role);
        setUser(data.username);
        setName(data.fullName);
        setRole(data.role);
    };

    const login = (username, password) => authenticate("auth/login", { username, password });
    const register = (form) => authenticate("auth/register", form);

    const logout = () => {
        KEYS.forEach((k) => localStorage.removeItem(k));
        setUser(null);
        setName(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, name, role, login, register, logout }}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);