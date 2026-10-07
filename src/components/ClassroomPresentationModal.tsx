import React from 'react';

interface ClassroomPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassroomPresentationModal: React.FC<ClassroomPresentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#faf8ff] z-50 flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-sm bg-surface-container-lowest p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 text-center border border-[#c5c5d3]/40">
        <div className="flex items-center justify-between w-full">
          <span className="font-label-badge text-secondary uppercase font-bold tracking-wider">
            Modo Presentación Aula
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Big high-contrast QR box */}
        <div className="p-4 bg-white rounded-xl shadow-inner border border-black/10 flex items-center justify-center">
          <svg className="w-64 h-64 text-on-surface" fill="currentColor" viewBox="0 0 160 160">
            <rect fill="none" height="40" rx="4" stroke="currentColor" stroke-width="8" width="40" x="10" y="10" />
            <rect fill="currentColor" height="16" width="16" x="22" y="22" />
            <rect fill="none" height="40" rx="4" stroke="currentColor" stroke-width="8" width="40" x="110" y="10" />
            <rect fill="currentColor" height="16" width="16" x="122" y="22" />
            <rect fill="none" height="40" rx="4" stroke="currentColor" stroke-width="8" width="40" x="10" y="110" />
            <rect fill="currentColor" height="16" width="16" x="22" y="122" />
            <rect height="10" rx="2" width="10" x="60" y="15" />
            <rect height="20" rx="2" width="10" x="80" y="15" />
            <rect height="10" rx="2" width="30" x="60" y="35" />
            <rect height="10" rx="2" width="15" x="10" y="60" />
            <rect height="10" rx="2" width="20" x="35" y="60" />
            <rect fill="#00236f" height="30" rx="4" width="30" x="65" y="55" />
            <circle cx="80" cy="70" fill="#6cf8bb" r="6" />
            <rect height="20" rx="2" width="15" x="105" y="60" />
            <rect height="10" rx="2" width="20" x="130" y="60" />
            <rect height="10" rx="2" width="30" x="15" y="80" />
            <rect height="10" rx="2" width="25" x="115" y="90" />
            <rect height="20" rx="2" width="15" x="60" y="95" />
            <rect height="10" rx="2" width="15" x="85" y="95" />
            <rect height="15" rx="2" width="25" x="60" y="125" />
            <rect height="35" rx="2" width="10" x="95" y="115" />
            <rect height="10" rx="2" width="35" x="115" y="115" />
            <rect height="15" rx="2" width="20" x="115" y="135" />
          </svg>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <span className="font-headline-md text-on-surface font-bold">
            Sofía Valentina Morales Peña
          </span>
          <span className="font-label-code text-primary font-bold text-[14px]">
            EST-2024-88412
          </span>
          <span className="font-body-sm text-on-surface-variant text-[11px] mt-1">
            Brillo al 100% aplicado para escaneo óptico rápido en terminal del docente
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-lg font-bold shadow-md transition-all active:scale-95"
        >
          Listo, regresar
        </button>
      </div>
    </div>
  );
};
