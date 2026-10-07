import React, { useState } from 'react';
import { AccessLog } from '../types';

interface AccessListScreenProps {
  logs: AccessLog[];
  onSelectLog: (log: AccessLog) => void;
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const AccessListScreen: React.FC<AccessListScreenProps> = ({
  logs,
  onSelectLog,
  showToast,
}) => {
  const [filterType, setFilterType] = useState<'todos' | 'ingreso' | 'salida'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'todos' || log.type === filterType;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      log.user.name.toLowerCase().includes(query) ||
      log.user.document.toLowerCase().includes(query) ||
      log.user.role.toLowerCase().includes(query) ||
      log.turnstile.toLowerCase().includes(query);
    return matchesType && matchesQuery;
  });

  const totalIngresos = logs.filter((l) => l.type === 'ingreso').length;
  const totalSalidas = logs.filter((l) => l.type === 'salida').length;

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pb-24 pt-2">
      {/* Title & Live Status */}
      <div className="flex items-center justify-between py-2 mb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              format_list_bulleted
            </span>
            <h2 className="font-headline-md text-on-surface">Bitácora de Accesos</h2>
          </div>
          <span className="font-body-sm text-on-surface-variant">
            Registro en tiempo real de torniquetes y porterías
          </span>
        </div>
        <button
          type="button"
          onClick={() => showToast('Bitácora sincronizada con el servidor central', true, 'refresh')}
          className="p-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-[#c5c5d3]/30"
          title="Actualizar registro"
        >
          <span className="material-symbols-outlined text-[18px]">sync</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-surface-container-lowest p-2.5 rounded-xl shadow-sm border border-[#c5c5d3]/20 text-center">
          <span className="font-label-sm text-on-surface-variant">Total Hoy</span>
          <p className="font-headline-lg-mobile text-on-surface font-bold mt-0.5">
            {1420 + logs.length}
          </p>
          <span className="font-label-badge text-secondary">99.4% Válidos</span>
        </div>
        <div className="bg-surface-container-lowest p-2.5 rounded-xl shadow-sm border border-[#c5c5d3]/20 text-center">
          <span className="font-label-sm text-on-surface-variant">Ingresos</span>
          <p className="font-headline-lg-mobile text-secondary font-bold mt-0.5">
            {890 + totalIngresos}
          </p>
          <span className="font-label-badge text-on-surface-variant">En campus</span>
        </div>
        <div className="bg-surface-container-lowest p-2.5 rounded-xl shadow-sm border border-[#c5c5d3]/20 text-center">
          <span className="font-label-sm text-on-surface-variant">Salidas</span>
          <p className="font-headline-lg-mobile text-primary font-bold mt-0.5">
            {530 + totalSalidas}
          </p>
          <span className="font-label-badge text-on-surface-variant">Registradas</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl p-2 shadow-sm border border-[#c5c5d3]/30">
          <span className="material-symbols-outlined text-outline text-[20px] ml-1">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, documento o torniquete..."
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType('todos')}
            className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              filterType === 'todos'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todos ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ingreso')}
            className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              filterType === 'ingreso'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Ingresos ({totalIngresos})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('salida')}
            className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              filterType === 'salida'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Salidas ({totalSalidas})
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex flex-col gap-2.5">
        {filteredLogs.map((log) => {
          const isIngreso = log.type === 'ingreso';
          return (
            <article
              key={log.id}
              onClick={() => onSelectLog(log)}
              className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-[#c5c5d3]/20 hover:border-primary/40 cursor-pointer transition-all active:scale-[0.99] flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={log.user.photoUrl}
                      alt={log.user.name}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm ring-1 ring-black/5"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[12px] shadow ${
                        isIngreso ? 'bg-secondary' : 'bg-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {isIngreso ? 'login' : 'logout'}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-label-lg font-bold text-on-surface truncate">
                        {log.user.name}
                      </h3>
                      <span className="font-label-badge bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded text-[10px]">
                        {log.user.role}
                      </span>
                    </div>
                    <p className="font-label-code text-on-surface-variant text-[12px] mt-0.5">
                      CC {log.user.document}
                    </p>
                    <p className="font-body-sm text-on-surface-variant text-[11px] truncate">
                      {log.user.programOrDepartment}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-label-code text-[12px] font-bold text-on-surface">
                    {log.timeFormatted}
                  </span>
                  <span className="font-label-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full uppercase">
                    AUTORIZADO
                  </span>
                </div>
              </div>

              {/* Sub-bar with turnstile & latency */}
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#c5c5d3]/20 text-on-surface-variant font-body-sm">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-medium text-primary">
                    <span className="material-symbols-outlined text-[14px]">meeting_room</span>
                    {log.turnstile}
                  </span>
                  <span>•</span>
                  <span>{log.gate}</span>
                </div>
                <div className="flex items-center gap-1 font-label-code text-secondary font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  <span>{log.latencySeconds}s</span>
                </div>
              </div>
            </article>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-sm">
            <span className="material-symbols-outlined text-outline text-[40px] mb-2">
              receipt_long
            </span>
            <p className="font-label-lg text-on-surface font-semibold">
              No hay registros que coincidan
            </p>
            <p className="font-body-sm text-on-surface-variant mt-1">
              Pruebe a cambiar los filtros o el término de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
