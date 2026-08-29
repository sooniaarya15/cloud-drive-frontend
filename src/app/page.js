"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Welcome, <span className="font-medium text-gray-900">{user?.name}</span> 👋
          <br />
          <span className="text-xs">Dashboard UI comes in Day 9</span>
        </p>
      </div>
    </ProtectedRoute>
  );
}