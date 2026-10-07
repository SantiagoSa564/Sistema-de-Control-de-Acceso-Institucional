import React, { useState } from 'react';
import { DeviceRecord } from '../types';

interface RegisterEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: Partial<DeviceRecord>) => void;
  prefillOwner?: { name: string; doc: string; type?: 'visitante' | 'academico' | 'institucional' };
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const RegisterEquipmentModal: React.FC<RegisterEquipmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  prefillOwner,
  showToast,
}) => {
  const [ownerType, setOwnerType] = useState<'visitante' | 'academico' | 'institucional'>(
    prefillOwner?.type || 'visitante'
  );
  const [eqType, setEqType] = useState('Laptop / Portátil');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [ownerName, setOwnerName] = useState(prefillOwner?.name || '');
  const [ownerDoc, setOwnerDoc] = useState(prefillOwner?.doc || '');
  const [hasPhoto, setHasPhoto] = useState(false);

  if (!isOpen) return null;

  const handleSimulateBarcodeScan = () => {
    const randomSN = 'SN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setSerial(randomSN);
    showToast(`Código de barras capturado: ${randomSN}`, true, 'barcode_scanner');
  };

  const handleCapturePhoto = () => {
    setHasPhoto(true);
    showToast('Fotografía de estado físico registrada con sello de tiempo', true, 'photo_camera');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim() || !brand.trim() || !ownerName.trim()) {
      showToast('Por favor complete los campos obligatorios (*)', false, 'warning');
      return;
    }

    const newDevice: Partial<DeviceRecord> = {
      name: `${brand} ${model || eqType}`.trim(),
      type: eqType,
      brand,
      model,
      serial: serial.toUpperCase(),
      ownerName,
      ownerDoc,
      ownerType,
      status: 'Dentro del Campus',
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gate: 'Puerta 1',
      photoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIeDoawExHGGN0zgB1SqHtFrPqfPb5T0CesiSSswa7Wrjwq_EcuMoSw1sr2_fuuEhcIIBI9f1HG9ZvthmKl3BVdN9RkmAxHLSQ2afHprZXmUXOPFIPfAjT6rejQ-NTMDzV6GW5aduHPJSiA49D1yAWL5LurF1OX-X0Zcvd3qxPSUPUlvTL8bezDsPO3_NBTR4T_kHgeDXelC9q4NMwf9AMXIKNgZrEZUn17HD3XC5vQZPTXcfLu83',
      inspectionPhotoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKYvTF8smEeF9-4Sjgq7yBL73l6XLA78RxNIDR_U2gJVD5ZI1BrXqisUnvJOynXCKgvtWMBD5fSoOEa0QyDrYGX_M_I7zSeJMg6b8kOAIARrrUdkRv4LO18Jr8vOLBzKY7Uz7USmNofxU-fZduFovbO-YHuzWKxMRIkyJcp1t3bcxaJEHzBYPPFikMPNt8lujLuSA0CWYXupri5bIyLlN5TzjA9lhtzRYlU_MiH3aK_cwVGTdNrft',
    };

    onSave(newDevice);
    showToast(`Equipo ${brand} (${serial}) ingresado correctamente. Registro activo.`, true, 'verified');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 bg-surface-container-low flex items-center justify-between flex-shrink-0 border-b border-[#c5c5d3]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">devices_other</span>
            </div>
            <div>
              <h2 className="font-headline-md text-on-surface font-bold leading-tight">
                Registro de Equipo
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Control de acceso y custodia de activos
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex flex-col gap-3.5">
          {/* Segmented chips de categoría rápida */}
          <div>
            <label className="block font-label-sm text-outline uppercase font-semibold mb-1.5">
              Tipo de Propietario / Uso
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setOwnerType('visitante')}
                className={`py-2 rounded-lg text-center font-label-lg transition-colors ${
                  ownerType === 'visitante'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Visitante
              </button>
              <button
                type="button"
                onClick={() => setOwnerType('academico')}
                className={`py-2 rounded-lg text-center font-label-lg transition-colors ${
                  ownerType === 'academico'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Docente/Est.
              </button>
              <button
                type="button"
                onClick={() => setOwnerType('institucional')}
                className={`py-2 rounded-lg text-center font-label-lg transition-colors ${
                  ownerType === 'institucional'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Institucional
              </button>
            </div>
          </div>

          {/* Tipo de Equipo */}
          <div>
            <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
              Tipo de Equipo *
            </label>
            <div className="bg-surface-container-low rounded-lg px-3 flex items-center h-12 shadow-sm border border-[#c5c5d3]/30">
              <span className="material-symbols-outlined text-outline mr-2 text-[20px]">
                category
              </span>
              <select
                value={eqType}
                onChange={(e) => setEqType(e.target.value)}
                required
                className="w-full bg-transparent font-body-md text-on-surface focus:outline-none"
              >
                <option value="Laptop / Portátil">Computador Portátil / Laptop</option>
                <option value="Tableta Digital">Tableta / iPad / Lector Digital</option>
                <option value="Proyector Multimedia">Proyector Multimedia / VideoBeam</option>
                <option value="Equipo Audiovisual">Cámara / Lente Fotográfico / Micrófonos</option>
                <option value="Instrumento de Laboratorio">Equipo Especializado de Laboratorio</option>
                <option value="Herramienta Eléctrica">Herramienta Técnica / Cableado</option>
              </select>
            </div>
          </div>

          {/* Marca y Modelo */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
                Marca *
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Dell, Lenovo, Apple"
                required
                className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
              />
            </div>
            <div>
              <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
                Modelo / Color
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ej: Latitude 5420 Gris"
                className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
              />
            </div>
          </div>

          {/* Número de Serial con Botón de Escáner */}
          <div>
            <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
              Número de Serial / Asset Tag *
            </label>
            <div className="bg-surface-container-low rounded-lg pl-3 pr-1 flex items-center h-12 shadow-sm border border-[#c5c5d3]/30">
              <span className="material-symbols-outlined text-outline mr-2 text-[20px]">tag</span>
              <input
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value.toUpperCase())}
                placeholder="Escanee o digite serial único"
                required
                className="w-full bg-transparent font-label-code text-on-surface focus:outline-none uppercase"
              />
              <button
                type="button"
                onClick={handleSimulateBarcodeScan}
                className="h-10 px-3 bg-primary-container hover:bg-primary text-on-primary rounded-md flex items-center gap-1 font-label-sm font-semibold hover:opacity-90 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                <span>Capturar</span>
              </button>
            </div>
          </div>

          {/* Propietario / Cédula */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
                Nombre Propietario / Responsable *
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Nombres y apellidos completos"
                required
                className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
              />
            </div>
            <div>
              <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
                Documento / Cédula / Pase *
              </label>
              <input
                type="text"
                value={ownerDoc}
                onChange={(e) => setOwnerDoc(e.target.value)}
                placeholder="Número de identificación"
                required
                className="w-full h-12 bg-surface-container-low rounded-lg px-3 font-body-md text-on-surface focus:outline-none shadow-sm border border-[#c5c5d3]/30"
              />
            </div>
          </div>

          {/* Fotografía de Estado Físico */}
          <div>
            <label className="block font-label-sm text-outline uppercase font-semibold mb-1">
              Fotografía del Estado Físico Actual
            </label>
            <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm border border-[#c5c5d3]/30">
              <div className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden flex-shrink-0 border border-black/5">
                {hasPhoto ? (
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnKYvTF8smEeF9-4Sjgq7yBL73l6XLA78RxNIDR_U2gJVD5ZI1BrXqisUnvJOynXCKgvtWMBD5fSoOEa0QyDrYGX_M_I7zSeJMg6b8kOAIARrrUdkRv4LO18Jr8vOLBzKY7Uz7USmNofxU-fZduFovbO-YHuzWKxMRIkyJcp1t3bcxaJEHzBYPPFikMPNt8lujLuSA0CWYXupri5bIyLlN5TzjA9lhtzRYlU_MiH3aK_cwVGTdNrft"
                    alt="Inspección estado físico"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-outline text-[32px]">
                    add_a_photo
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-label-lg text-on-surface block font-bold truncate">
                  Captura obligatoria de ingreso
                </span>
                <span className="font-body-sm text-on-surface-variant block text-[11px]">
                  Constancia de golpes, rayones o pegatinas previas
                </span>
              </div>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="h-10 px-3 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-lg font-label-lg font-bold flex items-center gap-1 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">camera_alt</span>
                <span>{hasPhoto ? 'Retomar' : 'Tomar'}</span>
              </button>
            </div>
          </div>

          {/* Footer Acciones */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-label-lg font-bold active:scale-98 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-12 bg-secondary hover:bg-[#005a3c] text-on-secondary rounded-xl font-label-lg font-bold flex items-center justify-center gap-1 shadow-md active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>Guardar e Ingresar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
