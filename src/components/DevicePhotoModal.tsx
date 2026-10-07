import React from 'react';
import { DeviceRecord } from '../types';

interface DevicePhotoModalProps {
  device: DeviceRecord | null;
  onClose: () => void;
}

export const DevicePhotoModal: React.FC<DevicePhotoModalProps> = ({ device, onClose }) => {
  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-[#c5c5d3]/30">
        <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-[#c5c5d3]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              photo_camera
            </span>
            <div className="min-w-0">
              <h3 className="font-label-lg font-bold text-on-surface truncate">
                Inspección Física: {device.name}
              </h3>
              <span className="font-label-code text-[11px] text-on-surface-variant">
                Serial: {device.serial}
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

        <div className="p-4 flex flex-col gap-3">
          {/* Main Inspection Photo */}
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black relative shadow-inner">
            <img
              src={device.inspectionPhotoUrl || device.photoUrl}
              alt={device.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-label-code flex items-center justify-between">
              <span>Sello: CUSTODIA-GATE-01</span>
              <span>{device.entryTime || '07:45 AM'}</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-3 rounded-xl border border-[#c5c5d3]/20 flex flex-col gap-1">
            <span className="font-label-sm text-outline uppercase font-bold">
              Observaciones de Ingreso
            </span>
            <p className="font-body-sm text-on-surface">
              {device.note || 'Hardware verificado sin rayones severos en tapa ni display. Sticker institucional visible.'}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
              <span>Responsable: <strong>{device.ownerName}</strong></span>
              <span>•</span>
              <span>Puerta 1</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full h-11 bg-primary text-on-primary rounded-xl font-label-lg font-bold hover:bg-primary-container transition-colors"
          >
            Cerrar Vista de Inspección
          </button>
        </div>
      </div>
    </div>
  );
};
