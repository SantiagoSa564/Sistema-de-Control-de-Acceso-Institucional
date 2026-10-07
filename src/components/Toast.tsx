import React from 'react';

interface ToastProps {
  message: string | null;
  isSuccess?: boolean;
  icon?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isSuccess = true, icon, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] sm:w-auto bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-2xl flex items-center justify-between gap-3 border border-white/10 animate-slideDown">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`material-symbols-outlined text-[20px] flex-shrink-0 ${
            isSuccess ? 'text-secondary-fixed' : 'text-error'
          }`}
        >
          {icon || (isSuccess ? 'check_circle' : 'error')}
        </span>
        <span className="font-label-lg font-medium text-[13px] truncate">
          {message}
        </span>
      </div>
      <button
        onClick={onClose}
        className="text-inverse-on-surface/70 hover:text-inverse-on-surface ml-1 p-0.5 rounded-full"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
