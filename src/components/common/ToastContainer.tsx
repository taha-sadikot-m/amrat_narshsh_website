'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notifications-container"
      aria-live="polite"
      className="pointer-events-none fixed bottom-20 right-4 z-50 flex w-full max-w-sm flex-col space-y-2 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 rounded-lg p-3.5 shadow-xl duration-200 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-[#2E7D32] text-white'
                : 'border border-[#F0E4D0] bg-white text-[#3E2723]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-white" />}
              {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-600" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-[#D46A1E]" />}
            </div>
            <div className="min-w-0 flex-1">
              <h5 className={`text-xs font-bold leading-tight ${isSuccess ? 'text-white' : 'text-[#3E2723]'}`}>
                {toast.title}
              </h5>
              <p className={`mt-0.5 text-[11px] leading-normal ${isSuccess ? 'text-white/90' : 'text-[#8D6E63]'}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`-mr-1 -mt-1 p-1 ${isSuccess ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
