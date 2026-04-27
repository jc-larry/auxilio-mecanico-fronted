// ── Service Request Models ──

// ServiceType ya no es un string union, viene de base de datos

export type Status = 'PENDIENTE' | 'EN_PROGRESO' | 'CRITICO' | 'COMPLETADO' | 'RECHAZADO';

export type Priority = 'alta' | 'media' | 'baja';

export interface ServiceRequest {
  id: number;
  code: string;
  client_name: string;
  vehicle_info: string;
  service_type: string;
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
  tipo_servicio_id: number;
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

// SERVICE_TYPE_OPTIONS ha sido eliminado, ahora se cargan dinámicamente.

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
