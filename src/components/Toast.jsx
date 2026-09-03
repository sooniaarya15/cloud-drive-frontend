"use client";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

let toastId = 0;

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const id = toastId++;
      const toast = { id, ...e.detail };
      setToasts((t) => [...t, toast]);
      setTimeout(() => remove(id), 4000);
    };
    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, [remove]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-100">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm text-white min-w-65 ${
            t.type === "error" ? "bg-red-600" : "bg-gray-900"
          }`}
        >
          {t.type === "error" ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// Helper to fire toasts from anywhere: toast.success("Uploaded!") / toast.error("Failed")
export const toast = {
  success: (message) => window.dispatchEvent(new CustomEvent("toast", { detail: { message, type: "success" } })),
  error: (message) => window.dispatchEvent(new CustomEvent("toast", { detail: { message, type: "error" } })),
};