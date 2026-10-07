import React, { useState } from 'react';
import { LOGO_URL } from '../data/mockData';
import { GuardOperator, UserRecord } from '../types';

interface CredentialValidationModalProps {
  user: UserRecord | null;
  mode?: 'ingreso' | 'salida';
  guard: GuardOperator;
  onClose: () => void;
  onConfirm: () => void;
  onRegisterIncident: (user: UserRecord) => void;
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const CredentialValidationModal: React.FC<CredentialValidationModalProps> = ({
  user,
  mode = 'ingreso',
  guard,
  onClose,
  onConfirm,
  onRegisterIncident,
  showToast,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!user) return null;

  const isIngreso = mode === 'ingreso';

  const handleConfirmAction = () => {
    setIsConfirmed(true);
    showToast(
      isIngreso
        ? `Acceso de ${user.name} verificado y torniquete habilitado`
        : `Salida de ${user.name} registrada correctamente`,
      true,
      'verified'
    );
    setTimeout(() => {
      onConfirm();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface flex flex-col min-h-screen">
      {/* Header específico de la pantalla de Validación */}
      <header className="sticky top-0 w-full z-20 bg-surface/90 backdrop-blur-xl border-b border-[#c5c5d3]/30 shadow-sm">
        <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              aria-label="Volver"
              className="w-10 h-10 -ml-1 flex items-center justify-center text-on-surface hover:bg-surface-container-high rounded-full active:scale-95 transition-transform flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img
              alt="Logo Acceso Institucional"
              className="h-7 w-auto object-contain flex-shrink-0"
              src={LOGO_URL}
            />
            <h1 className="font-headline-lg-mobile text-on-surface truncate leading-tight ml-1">
              Validacion Credencial
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-4 pb-8 flex flex-col gap-3.5">
        {/* 1. Gran Marco de Estado: Acceso Concedido / Ingreso Autorizado */}
        <div className="w-full bg-secondary-container rounded-xl p-4 shadow-md flex items-center justify-between gap-2 relative overflow-hidden border border-secondary/20">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-on-secondary-container/10 rounded-full pointer-events-none" />
          <div className="flex items-center gap-3.5 min-w-0 z-10">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-sm text-on-secondary">
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-badge text-on-secondary-container uppercase tracking-wider">
                {isIngreso ? 'Acceso Concedido' : 'Paso Verificado'}
              </span>
              <h2 className="font-headline-lg-mobile text-on-secondary-fixed font-bold leading-tight truncate">
                {isIngreso ? 'INGRESO AUTORIZADO' : 'SALIDA AUTORIZADA'}
              </h2>
              <span className="font-body-sm text-on-secondary-container flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">lock_open</span>{' '}
                {user.turnstile || 'Torniquete A-02'} Desbloqueado
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 z-10 text-right">
            <span className="inline-flex items-center gap-1 bg-surface-container-lowest/80 text-on-secondary-container px-2.5 py-1 rounded-full font-label-code text-[12px] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> 0.28s
            </span>
          </div>
        </div>

        {/* 2. Tarjeta con datos completos de la persona */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#c5c5d3]/20 flex flex-col gap-3.5">
          {/* Encabezado Perfil */}
          <div className="flex items-start gap-3.5">
            <div className="relative flex-shrink-0">
              <img
                className="w-20 h-24 object-cover rounded-lg shadow-sm"
                src={user.photoUrl}
                alt={user.name}
              />
              <div className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary rounded-full w-5 h-5 flex items-center justify-center shadow">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="inline-flex self-start items-center gap-1 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-label-badge mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {user.status || 'ESTUDIANTE ACTIVO'}
              </div>
              <h3 className="font-headline-md text-on-surface leading-snug font-bold">
                {user.name}
              </h3>
              <p className="font-label-code text-on-surface-variant text-[13px] mt-0.5 font-semibold">
                CC {user.document}
              </p>
            </div>
          </div>

          {/* Segmento Informativo Académico / Campus */}
          <div className="grid grid-cols-1 gap-1 bg-surface-container-low rounded-lg p-3 border border-[#c5c5d3]/20">
            <div className="flex items-center justify-between py-1 px-1">
              <span className="font-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">school</span>{' '}
                Programa / Ficha
              </span>
              <span className="font-label-lg text-on-surface text-right truncate max-w-[55%]">
                {user.programOrDepartment}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 px-1 border-t border-[#c5c5d3]/20">
              <span className="font-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>{' '}
                Jornada
              </span>
              <span className="font-body-md text-on-surface text-right font-medium">
                {user.schedule}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 px-1 border-t border-[#c5c5d3]/20">
              <span className="font-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">apartment</span>{' '}
                Ubicación
              </span>
              <span className="font-label-lg text-on-surface text-right">
                {user.location}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Sección especial: Dispositivos Vinculados al Usuario */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#c5c5d3]/20 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">devices</span>
              <h4 className="font-label-lg text-on-surface font-semibold">Inventario Autorizado</h4>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed font-label-badge px-2 py-0.5 rounded-full font-bold">
              {user.registeredDevices.length} DISPOSITIVO{user.registeredDevices.length !== 1 ? 'S' : ''}
            </span>
          </div>

          {/* Alerta informativa */}
          <div className="w-full bg-surface-container rounded-lg p-2.5 flex items-center gap-2 border border-[#c5c5d3]/20">
            <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">
              info
            </span>
            <p className="font-body-sm text-on-surface-variant">
              {user.registeredDevices.length > 0
                ? `${user.registeredDevices.length} equipo registrado previamente a su nombre para esta jornada académica.`
                : 'Sin equipos portátiles declarados en esta entrada.'}
            </p>
          </div>

          {/* Tarjetas de equipos vinculados */}
          {user.registeredDevices.map((dev, i) => (
            <div
              key={i}
              className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between gap-2 border border-[#c5c5d3]/20"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[22px]">laptop_chromebook</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-on-surface truncate font-semibold">
                    {dev.name}
                  </span>
                  <span className="font-label-code text-on-surface-variant text-[12px]">
                    {dev.serial}
                  </span>
                </div>
              </div>
              <span className="bg-primary-container text-on-primary font-label-badge px-2.5 py-1 rounded-full flex-shrink-0 shadow-sm flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[13px]">done</span> ENTRADA
              </span>
            </div>
          ))}
        </div>

        {/* 4. Barra de Acciones Rápidas para el Guarda */}
        <div className="w-full flex flex-col gap-2.5 pt-1">
          {/* Botón Primario: Confirmar Entrada */}
          <button
            type="button"
            onClick={handleConfirmAction}
            className={`w-full h-14 rounded-lg font-headline-md font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-on-secondary ${
              isConfirmed ? 'bg-[#004e33]' : 'bg-secondary hover:bg-[#005a3c]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isConfirmed ? 'check' : 'verified_user'}
            </span>
            <span>
              {isConfirmed
                ? `${isIngreso ? 'Entrada' : 'Salida'} Confirmada`
                : `Confirmar ${isIngreso ? 'Entrada' : 'Salida'}`}
            </span>
          </button>

          {/* Botón Secundario: Registrar Novedad / Equipos */}
          <button
            type="button"
            onClick={() => onRegisterIncident(user)}
            className="w-full h-12 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg font-label-lg font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">add_circle</span>
            <span>Registrar Novedad / Equipos</span>
          </button>

          {/* Botón Terciario: Escanear Siguiente */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-transparent text-primary hover:text-primary-container font-label-lg font-semibold flex items-center justify-center gap-1.5 active:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Escanear Siguiente</span>
          </button>
        </div>

        {/* 5. Sello de tiempo y auditoría en pie de página */}
        <div className="w-full bg-surface-container-low rounded-lg py-2 px-3 flex flex-col items-center justify-center text-center gap-0.5 mt-1 border border-[#c5c5d3]/20">
          <div className="flex items-center gap-1.5 font-label-code text-on-surface-variant text-[12px]">
            <span className="material-symbols-outlined text-[15px]">history_toggle_off</span>
            <span>24 Oct 2024, 08:15:32 AM</span>
          </div>
          <p className="font-body-sm text-outline">
            Operador de Control: <strong className="text-on-surface">{guard.name}</strong> •{' '}
            {guard.post}
          </p>
        </div>
      </main>
    </div>
  );
};
