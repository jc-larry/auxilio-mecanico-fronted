// ── Service Request Models ──

export type ServiceType =
  | 'towing'
  | 'tire_change'
  | 'battery'
  | 'lockout'
  | 'fuel'
  | 'diagnostics'
  | 'brakes'
  | 'oil_change'
  | 'transmission'
  | 'general';

export type Status = 'PENDIENTE' | 'EN_PROGRESO' | 'CRITICO' | 'COMPLETADO' | 'RECHAZADO';

export type Priority = 'alta' | 'media' | 'baja';

export interface ServiceRequest {
  id: number;
  code: string;
  client_name: string;
  vehicle_info: string;
  service_type: ServiceType;
  service_type_label: string;
  service_icon: string;
  description: string;
  location: string;
  status: Status;
  priority: Priority;
  assigned_mechanic: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  user_id: number;
}

export interface ServiceRequestCreate {
  cliente_id: number;
  vehiculo_id: number;
  service_type: ServiceType;
  description: string;
  location: string;
  priority: Priority;
}

export interface ServiceRequestUpdate {
  status?: Status;
  assigned_mechanic?: string | null;
  progress?: number;
  description?: string;
  priority?: Priority;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ServiceRequestStats {
  total_queue: number;
  avg_lead_time_hours: number;
  critical_count: number;
  completion_rate: number;
}

// ── Mapeos de UI ──

export const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: 'towing', label: 'Grúa / Remolque' },
  { value: 'tire_change', label: 'Cambio de Neumático' },
  { value: 'battery', label: 'Servicio de Batería' },
  { value: 'lockout', label: 'Apertura de Vehículo' },
  { value: 'fuel', label: 'Suministro de Combustible' },
  { value: 'diagnostics', label: 'Diagnóstico' },
  { value: 'brakes', label: 'Reparación de Frenos' },
  { value: 'oil_change', label: 'Cambio de Aceite' },
  { value: 'transmission', label: 'Transmisión' },
  { value: 'general', label: 'Servicio General' },
];

export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EN_PROGRESO', label: 'En Progreso' },
  { value: 'CRITICO', label: 'Crítico' },
  { value: 'COMPLETADO', label: 'Completado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
];

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];
