import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role, RoleCreate, RoleUpdate, PaginatedRoleResponse, Permission } from '../models/role.models';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly apiUrl = 'http://localhost:8000/api/v1/roles';
  private readonly permissionsUrl = 'http://localhost:8000/api/v1/permissions';

  constructor(private http: HttpClient) {}

  list(page: number = 1, perPage: number = 10): Observable<PaginatedRoleResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<PaginatedRoleResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  create(data: RoleCreate): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, data);
  }

  update(id: number, data: RoleUpdate): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.permissionsUrl);
  }
}
