"use client";
import { useState } from "react";
import Link from "next/link";
import { authService } from "@/lib/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      setSent(true);
      if (data.devResetUrl) setDevUrl(data.devResetUrl);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Something went wrong");
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

        <h1 className="text-xl font-semibold text-gray-900 mb-1">Reset your password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email and we&apos;ll send you a reset link
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {sent ? (
          <div className="text-sm text-gray-600 space-y-3">
            <p className="bg-green-50 border border-green-100 text-green-700 rounded-lg px-3 py-2">
              If that email exists, a reset link has been sent.
            </p>
            {devUrl && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-xs">
                <p className="font-medium text-yellow-800 mb-1">Dev mode — no email service configured:</p>
                <Link href={devUrl.replace(process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "", "")} className="text-indigo-600 underline break-all">
                  {devUrl}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          <Link href="/login" className="text-indigo-600 font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}