import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  PaginatedResponse,
  ServiceRequest,
  ServiceRequestCreate,
  ServiceRequestStats,
  ServiceRequestUpdate,
  Status,
} from '../models/service-request.models';

@Injectable({ providedIn: 'root' })
export class ServiceRequestService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/service-requests`;

  constructor(private http: HttpClient) {}

  list(
    page: number = 1,
    perPage: number = 10,
    statusFilter?: Status
  ): Observable<PaginatedResponse<ServiceRequest>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (statusFilter) {
      params = params.set('status', statusFilter);
    }

    return this.http.get<PaginatedResponse<ServiceRequest>>(this.apiUrl, { params });
  }

  getStats(): Observable<ServiceRequestStats> {
    return this.http.get<ServiceRequestStats>(`${this.apiUrl}/stats`);
  }

  getById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.apiUrl}/${id}`);
  }

  create(data: ServiceRequestCreate): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.apiUrl, data);
  }

  update(id: number, data: ServiceRequestUpdate): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
