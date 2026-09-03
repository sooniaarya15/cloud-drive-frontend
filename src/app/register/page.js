"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/lib/authService";
import { useAuthStore } from "@/store/authStore";

const NAME_REGEX = /^[A-Za-z\s.'-]+$/;

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleNameChange = (value) => {
    setForm({ ...form, name: value });
    if (value.trim() === "") {
      setNameError("");
    } else if (!NAME_REGEX.test(value)) {
      setNameError("Name can only contain letters and spaces (no numbers or symbols)");
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!NAME_REGEX.test(form.name.trim())) {
      setNameError("Name can only contain letters and spaces (no numbers or symbols)");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register(form);
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-semibold text-lg">CloudDrive</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Start storing files for free</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              placeholder="Full name"
              required
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                nameError
                  ? "border-red-300 focus:ring-red-400"
                  : "border-gray-200 focus:ring-indigo-500"
              }`}
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
          </div>

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 8 characters)"
              required
              minLength={8}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            disabled={loading || !!nameError}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}