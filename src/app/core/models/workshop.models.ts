export interface Workshop {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  telefono: string;
  estado: boolean;
}

export interface WorkshopCreate {
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  telefono: string;
  estado: boolean;
}

export interface WorkshopUpdate {
  nombre?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  telefono?: string;
  estado?: boolean;
}

export interface PaginatedWorkshopResponse {
  items: Workshop[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
