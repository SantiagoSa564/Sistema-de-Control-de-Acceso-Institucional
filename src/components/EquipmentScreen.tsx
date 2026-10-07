import React, { useState } from 'react';
import { DeviceRecord } from '../types';

interface EquipmentScreenProps {
  devices: DeviceRecord[];
  onOpenRegisterModal: () => void;
  onOpenAuditModal: () => void;
  onViewPhoto: (device: DeviceRecord) => void;
  onDeviceCheckout: (device: DeviceRecord) => void;
  onDeviceCheckin: (device: DeviceRecord) => void;
  onReportIncident: (device: DeviceRecord) => void;
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const EquipmentScreen: React.FC<EquipmentScreenProps> = ({
  devices,
  onOpenRegisterModal,
  onOpenAuditModal,
  onViewPhoto,
  onDeviceCheckout,
  onDeviceCheckin,
  onReportIncident,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'academico' | 'visitante' | 'institucional'>('todos');

  // Filter devices
  const filteredDevices = devices.filter((d) => {
    // Category match
    const categoryMatch =
      selectedFilter === 'todos' ||
      (selectedFilter === 'academico' && d.ownerType === 'academico') ||
      (selectedFilter === 'visitante' && d.ownerType === 'visitante') ||
      (selectedFilter === 'institucional' && d.ownerType === 'institucional');

    // Search query match
    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      d.name.toLowerCase().includes(query) ||
      d.serial.toLowerCase().includes(query) ||
      d.ownerName.toLowerCase().includes(query) ||
      d.ownerDoc.toLowerCase().includes(query) ||
      d.brand.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  const countAcademico = devices.filter((d) => d.ownerType === 'academico').length;
  const countVisitante = devices.filter((d) => d.ownerType === 'visitante').length;
  const countInstitucional = devices.filter((d) => d.ownerType === 'institucional').length;

  const handleScanBarcode = () => {
    showToast('Escáner de código de barras activado...', true, 'barcode_scanner');
    // Pre-fill a random query or simulate immediate finding
    const randomDev = devices[Math.floor(Math.random() * devices.length)];
    if (randomDev) {
      setTimeout(() => {
        setSearchQuery(randomDev.serial);
        showToast(`Código detectado: ${randomDev.serial} (${randomDev.name})`, true, 'qr_code_scanner');
      }, 700);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-24 pt-2">
      {/* 1. Banner Contextual y Alerta de Auditoría Rápida */}
      <section className="px-4 pt-2 pb-1">
        <div className="bg-primary-container text-on-primary rounded-xl p-4 shadow-md flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <span className="material-symbols-outlined text-secondary-fixed text-[24px]">
                verified_user
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-badge text-secondary-fixed uppercase tracking-wider">
                Protocolo de Custodia Activo
              </span>
              <p className="font-body-sm text-surface-container-highest truncate">
                Verificación biométrica y serial obligatoria en esclusa vehicular
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 relative z-10 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim animate-ping" />
            <span className="font-label-code text-secondary-fixed font-bold">LIVE</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-surface-container-lowest/5 pointer-events-none" />
        </div>
      </section>

      {/* 2. Métricas Rápidas del Día */}
      <section className="px-4 py-2">
        <div className="grid grid-cols-3 gap-2">
          {/* Métrica 1 */}
          <div className="bg-surface-container-lowest p-2.5 rounded-xl shadow-sm border border-[#c5c5d3]/20 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-primary mb-0.5">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span className="font-label-sm text-on-surface-variant font-medium">En Campus</span>
            </div>
            <span className="font-headline-lg-mobile text-on-surface font-bold tracking-tight">
              {139 + devices.length}
            </span>
            <span className="font-label-badge text-secondary font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-full mt-1">
              Activos
            </span>
          </div>

          {/* Métrica 2 */}
          <div className="bg-surface-container-lowest p-2.5 rounded-xl shadow-sm border border-[#c5c5d3]/20 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-secondary mb-0.5">
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span className="font-label-sm text-on-surface-variant font-medium">Ingresos</span>
            </div>
            <span className="font-headline-lg-mobile text-on-surface font-bold tracking-tight">
              {25 + devices.length}
            </span>
            <span className="font-label-badge text-on-surface-variant font-medium mt-1">
              Hoy
            </span>
          </div>

          {/* Métrica 3 */}
          <div className="bg-surface-container-lowest p-2.5 rounded-xl shadow-sm border border-[#c5c5d3]/20 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-tertiary-container mb-0.5">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="font-label-sm text-on-surface-variant font-medium">Salidas</span>
            </div>
            <span className="font-headline-lg-mobile text-on-surface font-bold tracking-tight">
              14
            </span>
            <span className="font-label-badge text-tertiary-container font-semibold bg-tertiary-fixed/60 px-2 py-0.5 rounded-full mt-1">
              Validadas
            </span>
          </div>
        </div>
      </section>

      {/* 3. Buscador y Escáner Rápido de Inventario */}
      <section className="px-4 py-1">
        <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl p-1.5 shadow-sm border border-[#c5c5d3]/30">
          <div className="flex items-center flex-1 min-w-0 px-2">
            <span className="material-symbols-outlined text-outline text-[20px] mr-2 flex-shrink-0">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Serial, marca o cédula de propietario..."
              className="w-full bg-transparent font-body-md text-on-surface placeholder:text-outline focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-outline hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleScanBarcode}
            className="h-11 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
            <span className="font-label-lg">Escanear</span>
          </button>
        </div>
      </section>

      {/* 4. Botón Destacado: Registrar Nuevo Equipo */}
      <section className="px-4 pt-1.5 pb-2">
        <button
          type="button"
          onClick={onOpenRegisterModal}
          className="w-full bg-secondary hover:bg-[#005a3c] text-on-secondary rounded-xl py-2.5 px-4 flex items-center justify-between shadow-md active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px] text-on-secondary">
                add_circle
              </span>
            </div>
            <div className="text-left">
              <span className="font-label-lg block leading-tight font-bold">
                Registrar Nuevo Equipo en Portería
              </span>
              <span className="font-body-sm text-secondary-fixed opacity-90">
                Visitante o ingreso no pre-declarado
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-on-secondary">
            arrow_forward
          </span>
        </button>
      </section>

      {/* 5. Pestañas de Filtro Horizontal */}
      <section className="px-4 py-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setSelectedFilter('todos')}
            className={`px-4 py-1.5 rounded-full font-label-lg flex-shrink-0 transition-colors ${
              selectedFilter === 'todos'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant font-medium hover:text-on-surface'
            }`}
          >
            Todos ({139 + devices.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('academico')}
            className={`px-4 py-1.5 rounded-full font-label-lg flex-shrink-0 transition-colors ${
              selectedFilter === 'academico'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant font-medium hover:text-on-surface'
            }`}
          >
            Estudiantes/Docentes ({95 + countAcademico})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('visitante')}
            className={`px-4 py-1.5 rounded-full font-label-lg flex-shrink-0 transition-colors ${
              selectedFilter === 'visitante'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant font-medium hover:text-on-surface'
            }`}
          >
            Visitantes ({31 + countVisitante})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('institucional')}
            className={`px-4 py-1.5 rounded-full font-label-lg flex-shrink-0 transition-colors ${
              selectedFilter === 'institucional'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant font-medium hover:text-on-surface'
            }`}
          >
            Préstamo Institucional ({11 + countInstitucional})
          </button>
        </div>
      </section>

      {/* 6. Encabezado de Lista */}
      <section className="px-4 pt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-headline-md text-on-surface font-bold">Tránsito Reciente</span>
          <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
        </div>
        <span className="font-body-sm text-on-surface-variant">
          Mostrando {filteredDevices.length} de {139 + devices.length}
        </span>
      </section>

      {/* 7. Lista de Dispositivos */}
      <section className="px-4 py-2 flex flex-col gap-3">
        {filteredDevices.map((device) => {
          const isInstitutional = device.ownerType === 'institucional';
          const isVisitor = device.ownerType === 'visitante';
          const isCheckedOut = device.status === 'Salida Registrada';

          return (
            <article
              key={device.id}
              className={`bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#c5c5d3]/20 flex flex-col gap-2.5 transition-all ${
                isCheckedOut ? 'opacity-70 bg-[#f8fafe]' : ''
              }`}
            >
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[28px]">
                      {device.type.includes('Proyector')
                        ? 'videocam'
                        : isVisitor
                        ? 'laptop_chromebook'
                        : 'laptop_mac'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="font-label-lg font-bold text-on-surface truncate">
                        {device.name}
                      </h2>
                      <span
                        className={`font-label-badge px-2 py-0.5 rounded-full font-bold ${
                          isVisitor
                            ? 'bg-tertiary-container text-on-tertiary'
                            : isInstitutional
                            ? 'bg-surface-container-highest text-primary'
                            : 'bg-surface-container-highest text-primary'
                        }`}
                      >
                        {isVisitor
                          ? 'Visitante'
                          : isInstitutional
                          ? 'Activo Fijo'
                          : 'Docente'}
                      </span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant truncate">
                      {device.ownerName}
                      {device.ownerDoc ? ` • ${device.ownerDoc}` : ''}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-label-sm text-outline uppercase font-semibold">
                        Serial:
                      </span>
                      <span className="font-label-code text-on-surface font-semibold bg-surface-container-low px-1.5 py-0.5 rounded">
                        {device.serial}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail foto */}
                <button
                  type="button"
                  onClick={() => onViewPhoto(device)}
                  className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container shadow-inner border border-black/5 hover:opacity-90 active:scale-95 transition-transform"
                  title="Ampliar foto del equipo"
                >
                  <img
                    src={device.photoUrl}
                    alt={device.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>

              {/* Sub-estado / Tag de condición */}
              {device.isFlagged ? (
                <div className="bg-tertiary-fixed/30 rounded-lg py-1 px-3 flex items-center justify-between border border-tertiary-container/20">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-tertiary-container text-[18px] flex-shrink-0">
                      warning
                    </span>
                    <span className="font-body-sm text-tertiary-container font-semibold truncate">
                      En tránsito con Instructor
                    </span>
                    <span className="font-label-sm text-tertiary-container/60">|</span>
                    <span className="font-body-sm text-tertiary-container truncate">
                      Prof. Marcos V.
                    </span>
                  </div>
                  <span className="font-label-badge text-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded uppercase font-bold">
                    En Revisión
                  </span>
                </div>
              ) : isVisitor ? (
                <div className="bg-secondary-container/30 rounded-lg py-1 px-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">
                      task_alt
                    </span>
                    <span className="font-body-sm text-on-surface font-medium truncate">
                      Verificado con pase temporal {device.passNumber || '#V-104'}
                    </span>
                  </div>
                  <span className="font-label-sm text-secondary font-bold">Válido hoy</span>
                </div>
              ) : (
                <div className="bg-surface-container-low rounded-lg py-1 px-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isCheckedOut ? 'bg-outline' : 'bg-secondary'
                      }`}
                    />
                    <span className="font-body-sm text-on-surface truncate">
                      {device.status}
                    </span>
                    <span className="font-label-sm text-outline-variant">|</span>
                    <span className="font-body-sm text-on-surface-variant">
                      Ingreso: {device.entryTime}
                    </span>
                  </div>
                  <span className="font-label-sm text-secondary font-bold">
                    {device.gate}
                  </span>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#c5c5d3]/20">
                <button
                  type="button"
                  onClick={() => onViewPhoto(device)}
                  className="text-outline hover:text-on-surface flex items-center gap-1 font-body-sm py-1 px-2 rounded-lg hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  <span>Ver Foto Estado</span>
                </button>

                {isInstitutional ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onReportIncident(device)}
                      className="text-error flex items-center gap-1 font-body-sm py-1 px-2 rounded-lg hover:bg-error-container/20"
                    >
                      <span className="material-symbols-outlined text-[18px]">report</span>
                      <span>Reportar Novedad</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeviceCheckin(device)}
                      className="h-10 px-3 bg-secondary hover:bg-[#005a3c] text-on-secondary rounded-lg font-label-lg font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>Reingreso a Bodega</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isVisitor && (
                      <span className="font-body-sm text-on-surface-variant hidden sm:flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">badge</span>
                        Pase activo
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={isCheckedOut}
                      onClick={() => onDeviceCheckout(device)}
                      className={`h-10 px-4 rounded-lg font-label-lg font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm ${
                        isCheckedOut
                          ? 'bg-surface-container-high text-outline cursor-not-allowed'
                          : 'bg-primary-container hover:bg-primary text-on-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isCheckedOut ? 'check' : 'logout'}
                      </span>
                      <span>{isCheckedOut ? 'Salida Lista' : 'Registrar Salida'}</span>
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {filteredDevices.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-outline text-[40px] mb-2">
              search_off
            </span>
            <p className="font-label-lg text-on-surface font-semibold">
              No se encontraron equipos
            </p>
            <p className="font-body-sm text-on-surface-variant mt-1">
              Pruebe con otro término de búsqueda o registre un nuevo activo.
            </p>
          </div>
        )}
      </section>

      {/* 8. Acceso Inferior: Historial de Auditoría de Equipos */}
      <section className="px-4 pt-3 pb-2">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#c5c5d3]/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">manage_history</span>
              </div>
              <div>
                <h3 className="font-label-lg text-on-surface font-bold">
                  Historial de Auditoría de Equipos
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Prevención de pérdidas y rastreo forense
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAuditModal}
              className="text-primary hover:text-primary-container font-label-lg font-bold flex items-center gap-0.5"
            >
              <span>Ver todo</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-container-low rounded-lg py-1.5 px-3 flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-outline uppercase font-semibold">
                    Rango Temporal
                  </span>
                  <span className="font-body-sm text-on-surface font-medium truncate">
                    Hoy (18 Oct 2024)
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  calendar_today
                </span>
              </div>

              <div className="bg-surface-container-low rounded-lg py-1.5 px-3 flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-outline uppercase font-semibold">
                    Discrepancias
                  </span>
                  <span className="font-body-sm text-secondary font-bold truncate">
                    0 Detectadas
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  security
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAuditModal}
              className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 font-label-lg font-semibold transition-colors mt-1"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">download</span>
              <span>Descargar Acta de Auditoría Diaria (PDF/CSV)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
