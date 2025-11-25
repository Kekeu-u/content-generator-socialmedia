"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Custom hook para gerenciamento de autenticação
 * Centraliza lógica de autenticação da aplicação
 *
 * @returns Estado de autenticação e métodos de login/logout
 *
 * @example
 * const { user, isLoading, isAuthenticated, login, logout } = useAuth();
 *
 * if (isLoading) return <Loading />;
 * if (!isAuthenticated) return <LoginForm onLogin={login} />;
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Verificar autenticação ao montar o componente
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Simulação - em produção, verificar token/session
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Simulação de login - em produção, chamar API de autenticação
      const mockUser: User = {
        id: "1",
        name: "Usuário Demo",
        email,
        role: "user",
      };

      localStorage.setItem("user", JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: "Falha no login" };
    }
  };

  const logout = async () => {
    try {
      // Limpar dados de autenticação
      localStorage.removeItem("user");

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false, error: "Falha no logout" };
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
  };
}
