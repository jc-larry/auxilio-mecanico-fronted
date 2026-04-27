// ── Mechanic Models ──

export type Specialty =
  | 'diesel'
  | 'electrico'
  | 'hidraulica'
  | 'transmision'
  | 'diagnostico'
  | 'general'
  | 'grua'
  | 'neumaticos'
  | 'frenos'
  | 'carroceria';


export interface Mechanic {
  id: number;
  full_name: string;
  initials: string;
  specialty: Specialty;
  specialty_label: string;
  specialty_icon: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
  workshop_id: number | null;
}

export interface MechanicCreate {
  full_name: string;
  specialty: Specialty;
  workshop_id: number | null;
}

export interface MechanicUpdate {
  full_name?: string;
  specialty?: Specialty;
  is_available?: boolean;
  workshop_id?: number | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface MechanicStats {
  total: number;
  available: number;
  unavailable: number;
  top_specialty: string;
  top_specialty_count: number;
}

// ── Options ──

export const SPECIALTY_OPTIONS: { value: Specialty; label: string }[] = [
  { value: 'diesel', label: 'Motor Diésel' },
  { value: 'electrico', label: 'Sistemas Eléctricos' },
  { value: 'hidraulica', label: 'Hidráulica' },
  { value: 'transmision', label: 'Transmisión' },
  { value: 'diagnostico', label: 'Diagnóstico' },
  { value: 'general', label: 'Mecánica General' },
  { value: 'grua', label: 'Grúa / Remolque' },
  { value: 'neumaticos', label: 'Neumáticos' },
  { value: 'frenos', label: 'Frenos' },
  { value: 'carroceria', label: 'Carrocería' },
];


