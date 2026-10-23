import { createContext, useContext, useState } from "react";
import {
    loginUser as loginRequest,
    registerUser as registerRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("authUser");

        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            localStorage.removeItem("authUser");
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem("authToken"));

    const login = async (credentials) => {
        const data = await loginRequest(credentials);

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data.user;
    };

    const register = async (userDetails) => {
        return await registerRequest(userDetails);
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem("authUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: Boolean(token && user),
                login,
                register,
                updateUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
}