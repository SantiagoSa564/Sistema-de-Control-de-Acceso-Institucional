export type ScreenTab = 'escanear' | 'accesos' | 'equipos' | 'carnet';

export interface DeviceRecord {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  serial: string;
  ownerName: string;
  ownerDoc: string;
  ownerType: 'visitante' | 'academico' | 'institucional';
  status: 'Dentro del Campus' | 'Salida Registrada' | 'En tránsito con Instructor' | 'En Bodega';
  entryTime: string;
  gate: string;
  photoUrl: string;
  inspectionPhotoUrl?: string;
  note?: string;
  passNumber?: string;
  isFlagged?: boolean;
  assignedLocation?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  document: string;
  role: 'Estudiante' | 'Docente' | 'Instructor' | 'Visitante' | 'Contratista' | 'Administrativo';
  photoUrl: string;
  programOrDepartment: string;
  codeOrFicha: string;
  schedule: string;
  location: string;
  status: 'ESTUDIANTE ACTIVO' | 'DOCENTE ACTIVO' | 'VISITANTE REGISTRADO' | 'EN REVISIÓN' | 'SUSPENDIDO';
  accessGranted: boolean;
  registeredDevices: {
    name: string;
    serial: string;
    type: string;
    verified: boolean;
  }[];
  turnstile?: string;
  recentScanTime?: string;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  timeFormatted: string;
  relativeTime: string;
  type: 'ingreso' | 'salida';
  user: UserRecord;
  authorized: boolean;
  gate: string;
  turnstile: string;
  latencySeconds: number;
  equipmentCount?: number;
}

export interface GuardOperator {
  name: string;
  badgeNumber: string;
  role: string;
  post: string;
  gate: string;
  status: 'En línea' | 'En descanso' | 'Relevo';
  shift: string;
  batteryLevel: string;
  syncActive: boolean;
  pendingSync: number;
  avatarUrl: string;
}
