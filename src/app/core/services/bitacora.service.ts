import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuditLogUser {
  id: number;
  full_name: string;

  email: string;
}

export interface AuditLog {
  id: number;
  usuario_id: number | null;
  accion: string;
  entidad: string;
  entidad_id: string | null;
  detalles: any;
  fecha_hora: string;
  usuario: AuditLogUser | null;
}

export interface PaginatedAuditLogResponse {
  items: AuditLog[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class BitacoraService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/v1/bitacora';

  getLogs(page: number = 1, perPage: number = 20): Observable<PaginatedAuditLogResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<PaginatedAuditLogResponse>(this.apiUrl, { params });
  }
}
