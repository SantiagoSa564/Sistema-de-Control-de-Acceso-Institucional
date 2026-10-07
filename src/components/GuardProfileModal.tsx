import React, { useState } from 'react';
import { GuardOperator } from '../types';

interface GuardProfileModalProps {
  guard: GuardOperator;
  isOpen: boolean;
  onClose: () => void;
  onUpdateGuard: (updated: Partial<GuardOperator>) => void;
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const GuardProfileModal: React.FC<GuardProfileModalProps> = ({
  guard,
  isOpen,
  onClose,
  onUpdateGuard,
  showToast,
}) => {
  const [selectedGate, setSelectedGate] = useState(guard.gate);
  const [selectedPost, setSelectedPost] = useState(guard.post);
  const [status, setStatus] = useState(guard.status);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateGuard({
      gate: selectedGate,
      post: selectedPost,
      status: status,
    });
    showToast('Configuración del puesto de control actualizada', true, 'tune');
    onClose();
  };

  const handleSyncManual = () => {
    showToast('Sincronizando 142 registros con el servidor central...', true, 'sync');
    setTimeout(() => {
      showToast('Base de datos y lista negra sincronizadas al 100%', true, 'cloud_done');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#c5c5d3]/30">
        <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-[#c5c5d3]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <div>
              <h2 className="font-headline-md text-on-surface font-bold leading-tight">
                Operador de Turno
              </h2>
              <span className="font-body-sm text-on-surface-variant">
                Identificación y Puesto de Guardia
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex flex-col gap-3.5">
          {/* Card del Oficial */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-[#c5c5d3]/30 shadow-sm flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-full bg-primary/10 overflow-hidden flex-shrink-0 border-2 border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[36px]">
                local_police
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-badge text-secondary uppercase tracking-wider font-bold">
                Acreditación Activa
              </span>
              <h3 className="font-label-lg font-bold text-on-surface text-[16px]">
                {guard.name}
              </h3>
              <p className="font-label-code text-on-surface-variant text-[12px]">
                Placa: {guard.badgeNumber} • {guard.role}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
                <span className="font-body-sm text-secondary font-bold text-[11px]">
                  Turno Activo: {guard.shift}
                </span>
              </div>
            </div>
          </div>

          {/* Estado Operativo */}
          <div>
            <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
              Estado de Disponibilidad
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['En línea', 'En descanso', 'Relevo'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 rounded-lg text-center font-label-lg transition-colors ${
                    status === st
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Configuración de Sede y Puesto */}
          <div>
            <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
              Sede y Puerta de Control
            </label>
            <select
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              className="w-full h-11 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none border border-[#c5c5d3]/30"
            >
              <option value="Sede Central - Puerta 1">Sede Central - Puerta 1 (Peatonal Principal)</option>
              <option value="Sede Central - Puerta 2">Sede Central - Puerta 2 (Esclusa Vehicular)</option>
              <option value="Sede Norte - Bahía A">Sede Norte - Bahía A (Auditorio)</option>
              <option value="Campus Sur - Portería 3">Campus Sur - Portería 3</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
              Puesto Físico
            </label>
            <input
              type="text"
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
              className="w-full h-11 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none border border-[#c5c5d3]/30"
            />
          </div>

          {/* Estado del Terminal Móvil */}
          <div className="bg-surface-container-low p-3 rounded-xl border border-[#c5c5d3]/20 flex flex-col gap-2">
            <span className="font-label-sm text-outline uppercase font-semibold">
              Diagnóstico del Dispositivo Rugged
            </span>
            <div className="grid grid-cols-2 gap-2 text-[12px] font-body-sm">
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  battery_charging_full
                </span>
                <span>Batería: <strong>{guard.batteryLevel}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  wifi
                </span>
                <span>Red: <strong>WiFi Institucional 5G</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  cloud_done
                </span>
                <span>Cola Offline: <strong>0 pendientes</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  qr_code_scanner
                </span>
                <span>Sensor: <strong>Zebra Óptico OK</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncManual}
              className="mt-1 w-full py-2 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-lg font-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Forzar Sincronización Manual</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-label-lg font-bold"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 h-11 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-lg font-bold shadow-md"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
