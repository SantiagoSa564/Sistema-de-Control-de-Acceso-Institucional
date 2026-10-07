import React from 'react';
import { DeviceRecord } from '../types';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: DeviceRecord[];
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  devices,
  showToast,
}) => {
  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const headers = 'ID,Nombre,Serial,Tipo,Propietario,Documento,Estado,Ingreso,Puerta\n';
    const rows = devices
      .map(
        (d) =>
          `"${d.id}","${d.name}","${d.serial}","${d.type}","${d.ownerName}","${d.ownerDoc}","${d.status}","${d.entryTime}","${d.gate}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Acta_Auditoria_Equipos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Acta de auditoría descargada en formato CSV', true, 'download');
  };

  const handlePrintPDF = () => {
    showToast('Generando reporte oficial firmado digitalmente...', true, 'picture_as_pdf');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#c5c5d3]/30">
        <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-[#c5c5d3]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </div>
            <div>
              <h2 className="font-headline-md text-on-surface font-bold leading-tight">
                Acta de Auditoría Diaria
              </h2>
              <span className="font-body-sm text-on-surface-variant">
                Control de Custodia y Activos en Tránsito
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

        <div className="p-4 overflow-y-auto flex flex-col gap-3">
          {/* Summary Box */}
          <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 rounded-xl border border-[#c5c5d3]/20 text-center">
            <div>
              <span className="font-label-sm text-outline uppercase font-semibold">
                Activos Totales
              </span>
              <p className="font-headline-md text-on-surface font-bold">
                {139 + devices.length}
              </p>
            </div>
            <div>
              <span className="font-label-sm text-outline uppercase font-semibold">
                Reingresos
              </span>
              <p className="font-headline-md text-secondary font-bold">14</p>
            </div>
            <div>
              <span className="font-label-sm text-outline uppercase font-semibold">
                Discrepancias
              </span>
              <p className="font-headline-md text-primary font-bold">0</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12px] text-on-surface-variant px-1 font-body-sm">
            <span>Fecha: <strong>18 Oct 2024 (Jornada Diurna)</strong></span>
            <span>Certificado SHA-256: <strong>8F9A-44B1</strong></span>
          </div>

          {/* Table preview */}
          <div className="border border-[#c5c5d3]/30 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-surface-container-high text-on-surface font-label-sm">
                <tr>
                  <th className="p-2">Equipo</th>
                  <th className="p-2">Serial</th>
                  <th className="p-2">Responsable</th>
                  <th className="p-2">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c5c5d3]/20">
                {devices.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container-low">
                    <td className="p-2 font-medium">{d.name}</td>
                    <td className="p-2 font-label-code text-[11px]">{d.serial}</td>
                    <td className="p-2 truncate max-w-[120px]">{d.ownerName}</td>
                    <td className="p-2">
                      <span className="font-label-badge text-secondary bg-secondary-container/40 px-1.5 py-0.5 rounded">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="h-11 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-label-lg font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#c5c5d3]/40"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">table_view</span>
              <span>Exportar CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrintPDF}
              className="h-11 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-lg font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>Imprimir PDF Oficial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
