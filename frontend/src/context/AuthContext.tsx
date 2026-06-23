import { useState, type ReactNode } from "react";
import type { LoginRequest, RegisterRequest } from "../types";
import { authApi } from "../api/auth";
import { clearTokens } from "../api/client";
import { AuthContext } from "../hooks/useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('accessToken'));

    const login = async (data: LoginRequest) => {
        const response = await authApi.login(data);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        setIsAuthenticated(true);
    };

    const register = async (data: RegisterRequest) => {
        const response = await authApi.register(data);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        clearTokens();
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
