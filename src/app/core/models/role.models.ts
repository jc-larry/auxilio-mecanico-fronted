export interface Permission {
  id: number;
  nombre: string;
}

export interface Role {
  id: number;
  nombre: string;
  permisos: Permission[];
}

export interface RoleCreate {
  nombre: string;
  permisos_ids: number[];
}

export interface RoleUpdate {
  nombre?: string;
  permisos_ids?: number[];
}

export interface PaginatedRoleResponse {
  items: Role[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
