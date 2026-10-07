import React, { useState } from 'react';
import { UserRecord } from '../types';

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterVisitor: (visitor: UserRecord) => void;
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const VisitorModal: React.FC<VisitorModalProps> = ({
  isOpen,
  onClose,
  onRegisterVisitor,
  showToast,
}) => {
  const [name, setName] = useState('');
  const [doc, setDoc] = useState('');
  const [company, setCompany] = useState('');
  const [reason, setReason] = useState('Reunión Oficial');
  const [destination, setDestination] = useState('Edificio Central - Piso 2');
  const [hasEquipment, setHasEquipment] = useState(false);
  const [eqSerial, setEqSerial] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !doc.trim()) {
      showToast('Por favor ingrese nombre y documento del visitante', false, 'warning');
      return;
    }

    const passNum = 'V-' + Math.floor(100 + Math.random() * 900);

    const newVisitor: UserRecord = {
      id: 'vis-' + Date.now(),
      name,
      document: doc,
      role: 'Visitante',
      photoUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      programOrDepartment: company ? `${company} (Visitante)` : 'Visita Externa Autorizada',
      codeOrFicha: passNum,
      schedule: 'Pase Temporal Válido Hoy',
      location: destination,
      status: 'VISITANTE REGISTRADO',
      accessGranted: true,
      turnstile: 'Esclusa Visitantes V-01',
      registeredDevices: hasEquipment && eqSerial ? [
        {
          name: 'Dispositivo Declarado Visitante',
          serial: eqSerial.toUpperCase(),
          type: 'Laptop / Portátil',
          verified: true,
        }
      ] : [],
    };

    onRegisterVisitor(newVisitor);
    showToast(`Pase temporal ${passNum} emitido para ${name}`, true, 'badge');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 bg-surface-container-low flex items-center justify-between flex-shrink-0 border-b border-[#c5c5d3]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">person_add</span>
            </div>
            <div>
              <h2 className="font-headline-md text-on-surface font-bold leading-tight">
                Registro Rápido de Visitante
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Emisión de credencial temporal de acceso
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex flex-col gap-3">
          <div>
            <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Andrés Camilo Parra"
              required
              className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
                Documento / Cédula *
              </label>
              <input
                type="text"
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
                placeholder="Ej. 1018442910"
                required
                className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
              />
            </div>
            <div>
              <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
                Empresa / Institución
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ej. Redes & Fibras"
                className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
                Motivo de Visita
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
              >
                <option value="Reunión Oficial">Reunión Oficial</option>
                <option value="Soporte Técnico / Contratista">Soporte Técnico</option>
                <option value="Trámite Administrativo">Trámite Administrativo</option>
                <option value="Proveedor / Encomienda">Proveedor / Encomienda</option>
                <option value="Invitado Académico">Invitado Académico</option>
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
                Destino / Dependencia
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ej. Rectoría, Edificio B"
                className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
              />
            </div>
          </div>

          {/* Declaración de equipo */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-[#c5c5d3]/30">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasEquipment}
                onChange={(e) => setHasEquipment(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-label-lg text-on-surface font-semibold">
                Declara ingreso con equipo de cómputo / herramientas
              </span>
            </label>
            {hasEquipment && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={eqSerial}
                  onChange={(e) => setEqSerial(e.target.value)}
                  placeholder="Serial del equipo (ej: SN-88219A)"
                  className="w-full h-10 bg-surface-container-lowest rounded-lg px-3 font-label-code text-on-surface uppercase border border-[#c5c5d3]/30"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-label-lg font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-12 bg-secondary hover:bg-[#005a3c] text-on-secondary rounded-xl font-label-lg font-bold shadow-md flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[20px]">badge</span>
              <span>Emitir Pase e Ingresar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
