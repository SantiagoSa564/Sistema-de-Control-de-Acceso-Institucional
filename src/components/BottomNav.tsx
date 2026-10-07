import React from 'react';
import { ScreenTab } from '../types';

interface BottomNavProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  pendingEquipmentCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange, pendingEquipmentCount }) => {
  const navItems: { tab: ScreenTab; label: string; icon: string }[] = [
    { tab: 'escanear', label: 'Escanear', icon: 'qr_code_scanner' },
    { tab: 'accesos', label: 'Accesos', icon: 'format_list_bulleted' },
    { tab: 'equipos', label: 'Equipos', icon: 'devices' },
    { tab: 'carnet', label: 'Carnet', icon: 'badge' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#faf8ff]/90 backdrop-blur-xl border-t border-[#c5c5d3]/30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`flex flex-col items-center justify-center min-w-[68px] min-h-[48px] py-1 transition-colors relative focus:outline-none ${
                isActive
                  ? 'text-primary-container font-bold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : undefined}
                >
                  {item.icon}
                </span>
                {item.tab === 'equipos' && pendingEquipmentCount && pendingEquipmentCount > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-tertiary-container text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    !
                  </span>
                ) : null}
              </div>
              <span className={`font-label-sm text-[11px] mt-0.5 ${isActive ? 'font-bold text-primary-container' : 'text-on-surface-variant'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
