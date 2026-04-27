export interface ServiceType {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
}

export interface ServiceTypeCreate {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
}

export interface ServiceTypeUpdate {
  nombre?: string;
  descripcion?: string | null;
  precio_base?: number;
}

export interface PaginatedServiceTypeResponse {
  items: ServiceType[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
