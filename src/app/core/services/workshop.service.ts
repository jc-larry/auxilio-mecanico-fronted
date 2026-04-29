import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workshop, WorkshopCreate, WorkshopUpdate, PaginatedWorkshopResponse } from '../models/workshop.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private apiUrl = `${API_CONFIG.baseUrl}/workshops`;

  constructor(private http: HttpClient) {}

  list(page: number = 1, perPage: number = 10): Observable<PaginatedWorkshopResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<PaginatedWorkshopResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Workshop> {
    return this.http.get<Workshop>(`${this.apiUrl}/${id}`);
  }

  create(data: WorkshopCreate): Observable<Workshop> {
    return this.http.post<Workshop>(this.apiUrl, data);
  }

  update(id: number, data: WorkshopUpdate): Observable<Workshop> {
    return this.http.patch<Workshop>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
