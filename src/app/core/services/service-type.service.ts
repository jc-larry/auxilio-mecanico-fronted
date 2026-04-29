import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  PaginatedServiceTypeResponse,
  ServiceType,
  ServiceTypeCreate,
  ServiceTypeUpdate,
} from '../models/service-type.models';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/service-types`;

  constructor(private http: HttpClient) {}

  list(page: number = 1, perPage: number = 10): Observable<PaginatedServiceTypeResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<PaginatedServiceTypeResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ServiceType> {
    return this.http.get<ServiceType>(`${this.apiUrl}/${id}`);
  }

  create(data: ServiceTypeCreate): Observable<ServiceType> {
    return this.http.post<ServiceType>(this.apiUrl, data);
  }

  update(id: number, data: ServiceTypeUpdate): Observable<ServiceType> {
    return this.http.patch<ServiceType>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
