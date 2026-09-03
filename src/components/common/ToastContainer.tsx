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
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#EADFCB] text-gray-900 rounded-2xl shadow-xl p-3.5 flex items-start space-x-3 animate-in slide-in-from-bottom-5 fade-in duration-200"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
              {toast.type === 'warning' && (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-[#C90018]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-gray-900 leading-tight">
                {toast.title}
              </h5>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-normal">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 p-1 -mr-1 -mt-1 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
