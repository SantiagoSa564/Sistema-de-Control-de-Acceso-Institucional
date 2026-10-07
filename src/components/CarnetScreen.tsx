import React, { useState, useEffect } from 'react';
import { LOGO_URL } from '../data/mockData';

interface CarnetScreenProps {
  onOpenClassroomPresentation: () => void;
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const CarnetScreen: React.FC<CarnetScreenProps> = ({
  onOpenClassroomPresentation,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'hoy' | 'equipos'>('hoy');
  const [countdown, setCountdown] = useState(42);
  const [isSavedOffline, setIsSavedOffline] = useState(false);

  // Dynamic anti-fraud token countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 45 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveOffline = () => {
    setIsSavedOffline(true);
    showToast('Carnet y token criptográfico sincronizados offline en tu billetera digital', true, 'cloud_done');
    setTimeout(() => setIsSavedOffline(false), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pb-24 pt-2">
      {/* 1. Encabezado de Carnet Oficial */}
      <div className="flex items-center justify-between py-2 mb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">
              verified_user
            </span>
            <span className="font-headline-md text-on-surface">Mi Carnet Oficial</span>
          </div>
          <span className="font-body-sm text-on-surface-variant">
            Válido para acceso a campus y aulas
          </span>
        </div>
        <button
          type="button"
          onClick={handleSaveOffline}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-highest hover:bg-surface-container-high transition-colors rounded-xl shadow-sm border border-[#c5c5d3]/30 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">
            {isSavedOffline ? 'check_circle' : 'account_balance_wallet'}
          </span>
          <span className="font-label-sm font-semibold text-on-surface">
            {isSavedOffline ? 'Guardado' : 'Guardar Offline'}
          </span>
        </button>
      </div>

      {/* 2. Tarjeta Holográfica / Carnet Digital */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0F172A] via-[#162a5b] to-[#1E3A8A] text-on-primary p-4 border border-white/10">
        {/* Glow ambient effects */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 bottom-12 w-44 h-44 rounded-full bg-primary-fixed/15 blur-xl pointer-events-none" />

        {/* Header de la Credencial */}
        <div className="flex items-center justify-between relative z-10 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container-lowest p-1 shadow-sm flex items-center justify-center">
              <img
                alt="Logo Acceso Institucional"
                className="w-full h-full object-contain"
                src={LOGO_URL}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-label-badge text-secondary-container tracking-wider uppercase">
                Credencial Digital
              </span>
              <span className="font-label-sm text-surface-container-highest/80">
                Acreditación Institucional
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/30 backdrop-blur-md border border-secondary-container/30">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping" />
            <span className="font-label-badge text-secondary-container tracking-widest uppercase">
              Activo 2024-2
            </span>
          </div>
        </div>

        {/* Perfil del Estudiante */}
        <div className="flex items-center gap-3.5 relative z-10 py-3">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-24 rounded-lg overflow-hidden bg-surface-container-lowest p-0.5 shadow-md">
              <img
                className="w-full h-full object-cover rounded"
                alt="Sofía Morales Peña"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo1YOF9en8AsrIL-d8jt3ALa3EJ9ThwsbYmL5Mm8dWp2HH8RDOD1jaLEaiYtrMcHgsKoh66lLjL4x9vWTi_Js-0uN4S2dox381GKT-KijUKkowfI0jcJbc6s58WAC-3j0R-4SG0QL3XuGIj1A4FJIaRSdcv7DmfMKl3BuXSK0gUI7RRQRn7uiz17FjndCKq0fEXCTwbOvfHWlbuxvbGBCRfj4azrtJvuNppn99sBdiVkX0g75OEL2T"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
            </div>
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <span className="font-body-sm text-secondary-container uppercase tracking-wide font-medium">
              Estudiante de Pregrado
            </span>
            <h2 className="font-headline-md text-on-primary truncate font-bold">
              Sofía Morales Peña
            </h2>
            <p className="font-body-sm text-surface-container-highest/90 truncate">
              Ingeniería de Software / ADSO
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-label-code text-primary-fixed-dim bg-white/10 px-2 py-0.5 rounded border border-white/10">
                EST-2024-88412
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Container con Tokens de Seguridad */}
        <div className="relative z-10 mt-1 p-3.5 bg-surface-container-lowest rounded-xl shadow-lg flex flex-col items-center">
          <div className="relative w-44 h-44 bg-surface-container-lowest flex items-center justify-center p-2 rounded-lg">
            <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 160 160">
              {/* QR corners */}
              <rect fill="none" height="40" rx="4" stroke="currentColor" stroke-width="8" width="40" x="10" y="10" />
              <rect fill="currentColor" height="16" width="16" x="22" y="22" />
              <rect fill="none" height="40" rx="4" stroke="currentColor" stroke-width="8" width="40" x="110" y="10" />
              <rect fill="currentColor" height="16" width="16" x="122" y="22" />
              <rect fill="none" height="40" rx="4" stroke="currentColor" stroke-width="8" width="40" x="10" y="110" />
              <rect fill="currentColor" height="16" width="16" x="22" y="122" />
              {/* Dynamic grid payload simulation */}
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

          <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[#c5c5d3]/30 text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">sync</span>
              <span className="font-label-badge text-on-surface font-bold">
                Se actualiza en {countdown}s
              </span>
            </div>
            <span className="font-label-code text-on-surface-variant font-bold text-[11px]">
              ANTI-FRAUDE RNF1
            </span>
          </div>
        </div>

        {/* Dynamic Token Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between mt-2.5 pt-2 text-surface-container-highest/80 font-body-sm">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary-container">
              fingerprint
            </span>
            <span className="font-label-sm">Token Dinámico Seguro</span>
          </div>
          <span className="font-label-code text-primary-fixed-dim font-bold">
            SIA-SEC-99210
          </span>
        </div>
      </div>

      {/* 3. Pestañas: Hoy vs Activos */}
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => setActiveTab('hoy')}
          className={`flex-1 py-2 px-3 rounded-lg font-label-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'hoy'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>Hoy</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('equipos')}
          className={`flex-1 py-2 px-3 rounded-lg font-label-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'equipos'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">laptop_mac</span>
          <span>Activos</span>
        </button>
      </div>

      {/* 4. Contenido Condicional */}
      {activeTab === 'hoy' ? (
        <div className="flex flex-col gap-2.5 mt-2.5">
          {/* Próxima Clase */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-[#c5c5d3]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
                Próxima Clase
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-badge">
                En 35 min
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">architecture</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-on-surface font-semibold truncate">
                  Arquitectura de Software
                </span>
                <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>08:00 AM - 10:00 AM</span>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm">
                  <span className="material-symbols-outlined text-[14px]">meeting_room</span>
                  <span className="font-medium text-primary">
                    Laboratorio de Cómputo 4 • Sede Central
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Asistencia Semestral */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-[#c5c5d3]/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  fact_check
                </span>
                <span className="font-label-lg text-on-surface font-semibold">
                  Asistencia Global Semestral
                </span>
              </div>
              <span className="font-label-badge text-secondary font-bold">96% CUMPLIDO</span>
            </div>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden mt-1">
              <div className="h-full bg-secondary rounded-full transition-all" style={{ width: '96%' }} />
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm pt-1">
              <span>48/50 Clases registradas</span>
              <span className="text-secondary font-medium">Sin alertas de inasistencia (RF13)</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 mt-2.5">
          {/* Equipo Vinculado */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-[#c5c5d3]/20 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">laptop</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-on-surface font-semibold truncate">
                  Laptop Dell Inspiron 14
                </span>
                <span className="font-label-code text-on-surface-variant text-[12px]">
                  Serial: D-8921B
                </span>
                <span className="font-body-sm text-secondary font-medium">
                  Autorizado ingreso con cargador
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-badge uppercase">
                Vinculado
              </span>
              <button
                type="button"
                onClick={() => showToast('Código de vinculación de equipo verificado', true, 'qr_code')}
                className="p-1 rounded-full text-on-surface-variant hover:text-primary transition-colors"
                title="Ver QR del equipo"
              >
                <span className="material-symbols-outlined text-[20px]">qr_code</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center gap-2.5 border border-[#c5c5d3]/20">
            <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">
              info
            </span>
            <p className="font-body-sm text-on-surface-variant">
              Presenta el código QR al ingresar por las bahías de seguridad para validar el porte de este activo.
            </p>
          </div>
        </div>
      )}

      {/* 5. Botón de Pantalla Completa: Presentar QR para Asistencia */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onOpenClassroomPresentation}
          className="w-full h-12 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-label-lg font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">brightness_high</span>
          <span>Presentar QR para Asistencia en Aula</span>
        </button>
      </div>
    </div>
  );
};
