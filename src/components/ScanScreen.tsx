import React, { useState, useEffect, useRef } from 'react';
import { AccessLog, UserRecord } from '../types';

interface ScanScreenProps {
  onScanUser: (user: UserRecord, mode: 'ingreso' | 'salida') => void;
  onOpenVisitorModal: () => void;
  users: UserRecord[];
  recentLogs: AccessLog[];
  onSelectLog: (log: AccessLog) => void;
  showToast: (msg: string, isSuccess?: boolean, icon?: string) => void;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onScanUser,
  onOpenVisitorModal,
  users,
  recentLogs,
  onSelectLog,
  showToast,
}) => {
  const [mode, setMode] = useState<'ingreso' | 'salida'>('ingreso');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualDoc, setManualDoc] = useState('');
  const [isRecentCollapsed, setIsRecentCollapsed] = useState(false);
  const [laserPos, setLaserPos] = useState(0);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [useRealCamera, setUseRealCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Laser scanner animation
  useEffect(() => {
    let dir = 1.8;
    let pos = -80;
    let frameId: number;

    const animate = () => {
      pos += dir;
      if (pos > 85) dir = -1.8;
      if (pos < -85) dir = 1.8;
      setLaserPos(pos);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Real webcam feed handler (optional toggle)
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: facingMode },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch((err) => {
          console.warn('Camera access unavailable:', err);
          setUseRealCamera(false);
          showToast('No se pudo acceder a la cámara. Usando visor simulado.', false, 'videocam_off');
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealCamera, facingMode, showToast]);

  const toggleFlash = () => {
    setIsTorchOn(!isTorchOn);
    showToast(!isTorchOn ? 'Flash encendido' : 'Flash apagado', true, !isTorchOn ? 'flash_on' : 'flash_off');
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    showToast('Cámara alternada', true, 'cameraswitch');
  };

  const handleValidateManual = () => {
    const query = manualDoc.trim().replace(/\./g, '').replace(/-/g, '');
    if (!query) {
      showToast('Ingrese un número de documento o carnet', false, 'warning');
      return;
    }

    // Search user by doc, code or partial name
    const found = users.find((u) => {
      const cleanDoc = u.document.replace(/\./g, '').replace(/-/g, '');
      const cleanCode = u.codeOrFicha.toLowerCase();
      return cleanDoc.includes(query) || cleanCode.includes(query.toLowerCase()) || u.name.toLowerCase().includes(query.toLowerCase());
    });

    if (found) {
      showToast(`Credencial verificada: ${found.name}`, true, 'how_to_reg');
      onScanUser(found, mode);
      setManualDoc('');
    } else {
      // Create a temporary unverified user or alert
      showToast(`Documento ${manualDoc} no encontrado en base activa`, false, 'error');
    }
  };

  const handleQuickDemoScan = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      showToast(`Escaneando QR de ${user.name}...`, true, 'qr_code_scanner');
      setTimeout(() => {
        onScanUser(user, mode);
      }, 350);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pb-24 pt-2">
      {/* 1. Selector de Modo: Ingreso / Salida */}
      <div className="flex items-center justify-between bg-surface-container-high rounded-full p-1 mb-3.5 shadow-sm">
        <button
          onClick={() => {
            setMode('ingreso');
            showToast('Modo de control: INGRESO', true, 'login');
          }}
          className={`flex-1 py-2.5 px-4 rounded-full font-label-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
            mode === 'ingreso'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          <span>Ingreso</span>
        </button>
        <button
          onClick={() => {
            setMode('salida');
            showToast('Modo de control: SALIDA', true, 'logout');
          }}
          className={`flex-1 py-2.5 px-4 rounded-full font-label-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
            mode === 'salida'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Salida</span>
        </button>
      </div>

      {/* 2. Banner de Sincronización */}
      <div className="flex items-center justify-between bg-surface-container px-4 py-2 rounded-lg mb-3.5 border border-[#c5c5d3]/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
          <span className="font-body-sm text-on-surface font-medium">Sincronización activa</span>
          <span className="font-body-sm text-on-surface-variant">• 0 pendientes</span>
        </div>
        <div className="flex items-center gap-1 text-secondary">
          <span className="material-symbols-outlined text-[18px]">cloud_done</span>
        </div>
      </div>

      {/* 3. Visor de Cámara y Retícula QR */}
      <div className="relative w-full aspect-[4/3] max-h-[300px] bg-inverse-surface rounded-xl overflow-hidden shadow-lg flex items-center justify-center mb-3 group">
        {/* Real video feed or simulated dark camera canvas */}
        {useRealCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-inverse-surface/90 to-inverse-surface flex items-center justify-center">
            {/* Ambient pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6cf8bb_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        )}

        {/* Torch highlight flash */}
        {isTorchOn && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none mix-blend-screen" />
        )}

        {/* QR Reticle Box */}
        <div className="relative w-56 h-56 rounded-lg flex items-center justify-center z-10 pointer-events-none">
          {/* Top Left Bracket */}
          <div
            className="absolute top-0 left-0 w-8 h-8 rounded-tl-lg bg-secondary-fixed-dim"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 4px, 4px 4px, 4px 100%, 0 100%)',
            }}
          />
          {/* Top Right Bracket */}
          <div
            className="absolute top-0 right-0 w-8 h-8 rounded-tr-lg bg-secondary-fixed-dim"
            style={{
              clipPath:
                'polygon(0 0, 100% 0, 100% 100%, calc(100% - 4px) 100%, calc(100% - 4px) 4px, 0 4px)',
            }}
          />
          {/* Bottom Left Bracket */}
          <div
            className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-lg bg-secondary-fixed-dim"
            style={{
              clipPath:
                'polygon(0 0, 4px 0, 4px calc(100% - 4px), 100% calc(100% - 4px), 100% 100%, 0 100%)',
            }}
          />
          {/* Bottom Right Bracket */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8 rounded-br-lg bg-secondary-fixed-dim"
            style={{
              clipPath:
                'polygon(calc(100% - 4px) 0, 100% 0, 100% 100%, 0 100%, 0 calc(100% - 4px), calc(100% - 4px) calc(100% - 4px))',
            }}
          />

          {/* Animated Laser Line */}
          {isScanningActive && (
            <div
              className="absolute w-full h-[3px] bg-secondary-fixed-dim shadow-[0_0_12px_#4edea3] transition-transform duration-75 pointer-events-none"
              style={{ transform: `translateY(${laserPos}px)` }}
            />
          )}

          {/* Background QR watermark inside reticle */}
          <span className="material-symbols-outlined text-[52px] text-inverse-on-surface/20">
            qr_code_scanner
          </span>
        </div>

        {/* Viewport Control Bar */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between px-1 pointer-events-auto z-20">
          {/* Flashlight button */}
          <button
            onClick={toggleFlash}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors shadow-md ${
              isTorchOn
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : 'bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface hover:bg-inverse-surface'
            }`}
            title="Encender Linterna"
            aria-label="Flash"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isTorchOn ? 'flash_on' : 'flash_off'}
            </span>
          </button>

          {/* Latency badge */}
          <div className="bg-inverse-surface/85 backdrop-blur-md px-3.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed-dim">
              speed
            </span>
            <span className="font-label-sm text-inverse-on-surface uppercase tracking-wider font-semibold">
              &lt; 3s Latencia
            </span>
          </div>

          {/* Camera switcher or webcam toggle */}
          <button
            onClick={toggleCamera}
            className="w-11 h-11 rounded-full bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface flex items-center justify-center hover:bg-inverse-surface transition-colors shadow-md"
            title="Alternar Cámara"
            aria-label="Alternar Cámara"
          >
            <span className="material-symbols-outlined text-[22px]">cameraswitch</span>
          </button>
        </div>

        {/* Quick webcam feed button top-right */}
        <button
          onClick={() => {
            const next = !useRealCamera;
            setUseRealCamera(next);
            showToast(next ? 'Activando cámara del dispositivo...' : 'Modo simulador activo', true, 'videocam');
          }}
          className="absolute top-2.5 right-3 bg-inverse-surface/80 backdrop-blur-md text-[11px] font-semibold text-inverse-on-surface px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 z-20 hover:bg-inverse-surface"
        >
          <span className="material-symbols-outlined text-[14px] text-secondary-fixed">
            {useRealCamera ? 'videocam' : 'smart_display'}
          </span>
          <span>{useRealCamera ? 'Cámara En Vivo' : 'Simulador'}</span>
        </button>
      </div>

      {/* Helper text */}
      <div className="flex items-center gap-1.5 justify-center mb-3 px-2">
        <span className="material-symbols-outlined text-[18px] text-primary">center_focus_strong</span>
        <p className="font-body-sm text-on-surface-variant text-center leading-tight">
          Apunte al QR del carnet digital o documento de visitante
        </p>
      </div>

      {/* Quick Test QR Trigger Chips (Facilitates testing the exact flow) */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="font-label-sm text-outline uppercase font-bold tracking-wider">
            Simular Escaneo Directo
          </span>
          <span className="font-body-sm text-on-surface-variant text-[11px]">Toque para probar</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => handleQuickDemoScan('user-camilo')}
            className="flex-shrink-0 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#c5c5d3]/40"
          >
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>Camilo Rodríguez (ADSO)</span>
          </button>
          <button
            onClick={() => handleQuickDemoScan('user-sofia')}
            className="flex-shrink-0 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#c5c5d3]/40"
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Sofía Morales (Carnet)</span>
          </button>
          <button
            onClick={() => handleQuickDemoScan('user-carlos-perez')}
            className="flex-shrink-0 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#c5c5d3]/40"
          >
            <span className="w-2 h-2 rounded-full bg-tertiary-container" />
            <span>Carlos Pérez (Visitante)</span>
          </button>
        </div>
      </div>

      {/* 4. Tarjeta de Validación Manual */}
      <div className="bg-surface-container-low rounded-xl p-4 mb-3.5 shadow-sm border border-[#c5c5d3]/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-primary">pin</span>
            <span className="font-label-lg text-on-surface font-semibold">Validación Manual</span>
          </div>
          <span className="font-label-sm text-on-surface-variant">Si el código está dañado</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="relative w-full">
            <input
              type="text"
              value={manualDoc}
              onChange={(e) => setManualDoc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleValidateManual()}
              placeholder="Ej. 1098234812 o 1020458912"
              className="w-full h-12 bg-surface-container-lowest rounded-lg px-4 pr-11 font-label-code text-on-surface placeholder:text-outline outline-none shadow-sm focus:ring-2 focus:ring-primary/40 transition-colors"
            />
            {manualDoc && (
              <button
                type="button"
                onClick={() => setManualDoc('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">backspace</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleValidateManual}
              className="h-12 bg-primary-container hover:bg-primary text-on-primary rounded-lg font-label-lg flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              <span>Validar</span>
            </button>
            <button
              type="button"
              onClick={onOpenVisitorModal}
              className="h-12 bg-surface-container-highest hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">person_add</span>
              <span>Visitante</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Acordeón: Últimos accesos escaneados */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#c5c5d3]/20">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setIsRecentCollapsed(!isRecentCollapsed)}
        >
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">history</span>
            <h3 className="font-label-lg text-on-surface font-bold">Últimos accesos escaneados</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-bold flex items-center justify-center">
              {recentLogs.length}
            </span>
            <span
              className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
                isRecentCollapsed ? '-rotate-90' : 'rotate-0'
              }`}
            >
              expand_more
            </span>
          </div>
        </div>

        {!isRecentCollapsed && (
          <div className="flex flex-col gap-2 mt-2.5 transition-all duration-300">
            {recentLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                onClick={() => onSelectLog(log)}
                className="flex items-center justify-between p-2.5 bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={log.user.photoUrl}
                    alt={log.user.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0 ring-1 ring-black/5"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-on-surface truncate font-semibold leading-tight">
                      {log.user.name}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-body-sm text-on-surface-variant text-[11px]">
                        {log.user.role}
                      </span>
                      <span className="font-body-sm text-outline">•</span>
                      <span className="font-body-sm text-on-surface-variant text-[11px]">
                        {log.relativeTime} ({log.timeFormatted})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-container px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container" />
                  <span className="font-label-badge text-on-secondary-container uppercase">
                    AUTORIZADO
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
