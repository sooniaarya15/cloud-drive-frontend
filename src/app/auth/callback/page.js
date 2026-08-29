"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";
import { useAuthStore } from "@/store/authStore";

// Backend sets httpOnly cookies after Google login and redirects here.
// We just need to fetch /me (cookie-based) to hydrate the session,
// then mirror the access token into localStorage for the axios interceptor.
export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    authService
      .me()
      .then((user) => {
        setUser(user);
        router.replace("/");
      })
      .catch(() => router.replace("/login"));
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Signing you in...
    </div>
  );
}