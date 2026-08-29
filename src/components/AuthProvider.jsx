"use client";
import { useEffect } from "react";
import { authService } from "@/lib/authService";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      clearUser();
      return;
    }
    authService
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("accessToken");
        clearUser();
      });
  }, [setUser, clearUser]);

  return children;
}