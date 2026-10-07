import React, { useState } from 'react';
import {
  INITIAL_ACCESS_LOGS,
  INITIAL_DEVICES,
  INITIAL_GUARD,
  INITIAL_USERS,
} from './data/mockData';
import { AccessLog, DeviceRecord, GuardOperator, ScreenTab, UserRecord } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ScanScreen } from './components/ScanScreen';
import { AccessListScreen } from './components/AccessListScreen';
import { EquipmentScreen } from './components/EquipmentScreen';
import { CarnetScreen } from './components/CarnetScreen';
import { CredentialValidationModal } from './components/CredentialValidationModal';
import { RegisterEquipmentModal } from './components/RegisterEquipmentModal';
import { VisitorModal } from './components/VisitorModal';
import { GuardProfileModal } from './components/GuardProfileModal';
import { DevicePhotoModal } from './components/DevicePhotoModal';
import { AuditReportModal } from './components/AuditReportModal';
import { ClassroomPresentationModal } from './components/ClassroomPresentationModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('escanear');
  const [guard, setGuard] = useState<GuardOperator>(INITIAL_GUARD);
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [devices, setDevices] = useState<DeviceRecord[]>(INITIAL_DEVICES);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(INITIAL_ACCESS_LOGS);

  // Modals & Overlays
  const [validationUser, setValidationUser] = useState<UserRecord | null>(null);
  const [validationMode, setValidationMode] = useState<'ingreso' | 'salida'>('ingreso');
  const [isRegisterEquipmentOpen, setIsRegisterEquipmentOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isGuardProfileOpen, setIsGuardProfileOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isClassroomPresentationOpen, setIsClassroomPresentationOpen] = useState(false);
  const [viewingPhotoDevice, setViewingPhotoDevice] = useState<DeviceRecord | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    message: string | null;
    isSuccess?: boolean;
    icon?: string;
  }>({ message: null });

  const showToast = (message: string, isSuccess = true, icon?: string) => {
    setToast({ message, isSuccess, icon });
    setTimeout(() => {
      setToast((prev) => (prev.message === message ? { message: null } : prev));
    }, 3500);
  };

  // Handler: User Scanned / Manual Validation triggered
  const handleScanUser = (user: UserRecord, mode: 'ingreso' | 'salida') => {
    setValidationUser(user);
    setValidationMode(mode);
  };

  // Handler: Confirm Entry or Exit from validation modal
  const handleConfirmValidation = () => {
    if (!validationUser) return;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: AccessLog = {
      id: 'log-' + Date.now(),
      timestamp: now.toISOString(),
      timeFormatted,
      relativeTime: 'Justo ahora',
      type: validationMode,
      user: validationUser,
      authorized: true,
      gate: guard.gate,
      turnstile: validationUser.turnstile || 'Torniquete A-02',
      latencySeconds: 0.28,
      equipmentCount: validationUser.registeredDevices.length,
    };

    setAccessLogs((prev) => [newLog, ...prev]);
    setValidationUser(null);
  };

  // Handler: Save New Equipment
  const handleSaveEquipment = (deviceData: Partial<DeviceRecord>) => {
    const newDevice: DeviceRecord = {
      id: 'dev-' + Date.now(),
      name: deviceData.name || 'Dispositivo Tecnológico',
      type: deviceData.type || 'Laptop / Portátil',
      brand: deviceData.brand || 'Genérico',
      model: deviceData.model || '',
      serial: deviceData.serial || 'SN-UNKNOWN',
      ownerName: deviceData.ownerName || 'Propietario',
      ownerDoc: deviceData.ownerDoc || '',
      ownerType: deviceData.ownerType || 'visitante',
      status: 'Dentro del Campus',
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gate: guard.gate,
      photoUrl: deviceData.photoUrl || INITIAL_DEVICES[0].photoUrl,
      inspectionPhotoUrl: deviceData.inspectionPhotoUrl,
      note: 'Ingreso registrado en portería bajo custodia activa',
    };

    setDevices((prev) => [newDevice, ...prev]);
  };

  // Handler: Register New Visitor
  const handleRegisterVisitor = (visitor: UserRecord) => {
    setUsers((prev) => [visitor, ...prev]);

    // If visitor declared equipment, add to equipment database too
    if (visitor.registeredDevices.length > 0) {
      visitor.registeredDevices.forEach((dev) => {
        const newDev: DeviceRecord = {
          id: 'dev-' + Date.now() + Math.random(),
          name: dev.name,
          type: dev.type,
          brand: 'Declarado',
          model: 'Equipo Portátil',
          serial: dev.serial,
          ownerName: visitor.name,
          ownerDoc: visitor.document,
          ownerType: 'visitante',
          status: 'Dentro del Campus',
          entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          gate: guard.gate,
          passNumber: visitor.codeOrFicha,
          photoUrl: INITIAL_DEVICES[2].photoUrl,
        };
        setDevices((prev) => [newDev, ...prev]);
      });
    }

    // Automatically trigger validation view for immediate gate opening
    handleScanUser(visitor, 'ingreso');
  };

  // Equipment actions
  const handleDeviceCheckout = (device: DeviceRecord) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === device.id ? { ...d, status: 'Salida Registrada' } : d))
    );
    showToast(`Salida autorizada: ${device.name} [${device.serial}] - ${device.ownerName}`, true, 'logout');
  };

  const handleDeviceCheckin = (device: DeviceRecord) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === device.id ? { ...d, status: 'En Bodega', isFlagged: false } : d))
    );
    showToast(`Reingreso registrado: ${device.name} [${device.serial}] devuelto a Bodega`, true, 'check_circle');
  };

  const handleReportIncident = (device: DeviceRecord) => {
    showToast(`Novedad reportada sobre serial ${device.serial}. Notificación enviada a Seguridad.`, false, 'report');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md text-on-surface">
      {/* Global Fixed Header */}
      <Header
        currentTab={currentTab}
        guard={guard}
        onOpenGuardProfile={() => setIsGuardProfileOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 w-full pt-16">
        {currentTab === 'escanear' && (
          <ScanScreen
            onScanUser={handleScanUser}
            onOpenVisitorModal={() => setIsVisitorModalOpen(true)}
            users={users}
            recentLogs={accessLogs}
            onSelectLog={(log) => handleScanUser(log.user, log.type)}
            showToast={showToast}
          />
        )}

        {currentTab === 'accesos' && (
          <AccessListScreen
            logs={accessLogs}
            onSelectLog={(log) => handleScanUser(log.user, log.type)}
            showToast={showToast}
          />
        )}

        {currentTab === 'equipos' && (
          <EquipmentScreen
            devices={devices}
            onOpenRegisterModal={() => setIsRegisterEquipmentOpen(true)}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
            onViewPhoto={(device) => setViewingPhotoDevice(device)}
            onDeviceCheckout={handleDeviceCheckout}
            onDeviceCheckin={handleDeviceCheckin}
            onReportIncident={handleReportIncident}
            showToast={showToast}
          />
        )}

        {currentTab === 'carnet' && (
          <CarnetScreen
            onOpenClassroomPresentation={() => setIsClassroomPresentationOpen(true)}
            showToast={showToast}
          />
        )}
      </main>

      {/* Global Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        pendingEquipmentCount={devices.filter((d) => d.isFlagged).length}
      />

      {/* Modals & Fullscreen Overlays */}
      {validationUser && (
        <CredentialValidationModal
          user={validationUser}
          mode={validationMode}
          guard={guard}
          onClose={() => setValidationUser(null)}
          onConfirm={handleConfirmValidation}
          onRegisterIncident={(user) => {
            setIsRegisterEquipmentOpen(true);
            setValidationUser(null);
          }}
          showToast={showToast}
        />
      )}

      <RegisterEquipmentModal
        isOpen={isRegisterEquipmentOpen}
        onClose={() => setIsRegisterEquipmentOpen(false)}
        onSave={handleSaveEquipment}
        showToast={showToast}
      />

      <VisitorModal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        onRegisterVisitor={handleRegisterVisitor}
        showToast={showToast}
      />

      <GuardProfileModal
        guard={guard}
        isOpen={isGuardProfileOpen}
        onClose={() => setIsGuardProfileOpen(false)}
        onUpdateGuard={(updated) => setGuard((prev) => ({ ...prev, ...updated }))}
        showToast={showToast}
      />

      <DevicePhotoModal
        device={viewingPhotoDevice}
        onClose={() => setViewingPhotoDevice(null)}
      />

      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        devices={devices}
        showToast={showToast}
      />

      <ClassroomPresentationModal
        isOpen={isClassroomPresentationOpen}
        onClose={() => setIsClassroomPresentationOpen(false)}
      />

      {/* Toast feedback */}
      <Toast
        message={toast.message}
        isSuccess={toast.isSuccess}
        icon={toast.icon}
        onClose={() => setToast({ message: null })}
      />
    </div>
  );
}
