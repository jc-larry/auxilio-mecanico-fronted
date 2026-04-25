export interface Client {
  id: number;
  usuario_id: number;
  nombre: string;
  email: string;
}

export interface PaginatedClientResponse {
  items: Client[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
