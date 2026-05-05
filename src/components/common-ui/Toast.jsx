import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const ToastContext = createContext(null);

let idSeq = 0;

const VARIANT_CLASS = {
  success: "bg-success-50 text-success-700 border-success-200",
  error: "bg-error-50 text-error-700 border-error-200",
  info: "bg-primary-50 text-primary-700 border-primary-200",
  warning: "bg-warning-50 text-warning-700 border-warning-200",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, { variant = "info", duration = 4000 } = {}) => {
      const id = ++idSeq;
      setToasts((curr) => [...curr, { id, message, variant, duration }]);
      return id;
    },
    []
  );

  const api = {
    push,
    success: (m, o) => push(m, { ...o, variant: "success" }),
    error: (m, o) => push(m, { ...o, variant: "error" }),
    info: (m, o) => push(m, { ...o, variant: "info" }),
    warning: (m, o) => push(m, { ...o, variant: "warning" }),
    dismiss: remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    if (!toast.duration) return;
    const id = setTimeout(onClose, toast.duration);
    return () => clearTimeout(id);
  }, [toast.duration, onClose]);

  const variantClass = VARIANT_CLASS[toast.variant] ?? VARIANT_CLASS.info;
  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md text-sm ${variantClass}`}
    >
      <div className="flex-1 leading-snug">{toast.message}</div>
      <button
        type="button"
        onClick={onClose}
        className="text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <AiOutlineClose className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      push: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
      dismiss: () => {},
    };
  }
  return ctx;
}
