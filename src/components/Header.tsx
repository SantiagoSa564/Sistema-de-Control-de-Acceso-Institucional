import React from 'react';
import { LOGO_URL } from '../data/mockData';
import { GuardOperator, ScreenTab } from '../types';

interface HeaderProps {
  currentTab: ScreenTab;
  guard: GuardOperator;
  onOpenGuardProfile: () => void;
}

const TAB_TITLES: Record<ScreenTab, string> = {
  escanear: 'Escanear',
  accesos: 'Accesos',
  equipos: 'Equipos',
  carnet: 'Carnet',
};

export const Header: React.FC<HeaderProps> = ({ currentTab, guard, onOpenGuardProfile }) => {
  return (
    <header className="fixed top-0 w-full z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-[#c5c5d3]/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between gap-2">
        {/* Institutional Title & Gate */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="Logo Acceso Institucional"
            className="h-8 w-auto object-contain flex-shrink-0"
            src={LOGO_URL}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-label-lg text-on-surface font-bold truncate leading-tight">
                {guard.gate}
              </span>
              <span className="font-body-sm text-outline">•</span>
              <span className="font-body-sm text-on-surface-variant font-medium truncate">
                {TAB_TITLES[currentTab]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse flex-shrink-0" />
              <span className="font-label-sm text-secondary font-bold uppercase tracking-wider">
                {guard.status}
              </span>
              <span className="font-label-sm text-outline-variant">|</span>
              <span className="font-label-sm text-on-surface-variant truncate">
                {guard.syncActive ? 'Sync activa' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Guard Operator Quick Profile Trigger */}
        <button
          onClick={onOpenGuardProfile}
          className="flex items-center gap-1 p-1 rounded-full hover:bg-surface-container-high transition-transform active:scale-95 flex-shrink-0 focus:outline-none"
          title="Ver perfil de operador y turno"
          aria-label="Perfil del guarda"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm ring-2 ring-primary/20">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </button>
      </div>
    </header>
  );
};
