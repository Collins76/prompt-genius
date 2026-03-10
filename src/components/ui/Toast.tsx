"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

let addToast: (type: ToastType, message: string) => void;

export function toast(type: ToastType, message: string) {
  addToast?.(type, message);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToast = (type, message) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const icons = {
    success: <CheckCircle size={18} className="text-[var(--success)]" />,
    error: <XCircle size={18} className="text-[var(--danger)]" />,
    info: <AlertCircle size={18} className="text-[var(--accent)]" />,
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-lg animate-slideIn min-w-[300px]"
        >
          {icons[t.type]}
          <span className="flex-1 text-sm">{t.message}</span>
          <button onClick={() => remove(t.id)} className="p-0.5 hover:bg-[var(--bg-tertiary)] rounded cursor-pointer">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
