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

export type MechanicExpertise = 'SENIOR' | 'INTERMEDIO' | 'JUNIOR';

export interface Mechanic {
  id: number;
  employee_code: string;
  full_name: string;
  initials: string;
  phone: string;
  specialty: Specialty;
  specialty_label: string;
  specialty_icon: string;
  expertise: MechanicExpertise;
  expertise_label: string;
  is_available: boolean;
  avatar_color: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface MechanicCreate {
  full_name: string;
  phone: string;
  specialty: Specialty;
  expertise: MechanicExpertise;
  avatar_color: string;
}

export interface MechanicUpdate {
  full_name?: string;
  phone?: string;
  specialty?: Specialty;
  expertise?: MechanicExpertise;
  is_available?: boolean;
  avatar_color?: string;
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

export const EXPERTISE_OPTIONS: { value: MechanicExpertise; label: string }[] = [
  { value: 'SENIOR', label: 'Senior' },
  { value: 'INTERMEDIO', label: 'Intermedio' },
  { value: 'JUNIOR', label: 'Junior' },
];

export const AVATAR_COLORS: string[] = [
  '#091426', '#9d4300', '#3c475a', '#1e293b', '#4a2c6e',
  '#1a4731', '#6b2130', '#2c3e50', '#7c4a03', '#0c4a6e',
];
