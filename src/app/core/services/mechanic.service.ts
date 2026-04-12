import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Mechanic,
  MechanicCreate,
  MechanicStats,
  MechanicUpdate,
  PaginatedResponse,
} from '../models/mechanic.models';

@Injectable({ providedIn: 'root' })
export class MechanicService {
  private readonly apiUrl = 'http://localhost:8000/api/v1/mechanics';

  constructor(private http: HttpClient) {}

  list(
    page: number = 1,
    perPage: number = 10,
    available?: boolean,
    specialty?: string,
  ): Observable<PaginatedResponse<Mechanic>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (available !== undefined) {
      params = params.set('available', available.toString());
    }
    if (specialty) {
      params = params.set('specialty', specialty);
    }

    return this.http.get<PaginatedResponse<Mechanic>>(this.apiUrl, { params });
  }

  getStats(): Observable<MechanicStats> {
    return this.http.get<MechanicStats>(`${this.apiUrl}/stats`);
  }

  getById(id: number): Observable<Mechanic> {
    return this.http.get<Mechanic>(`${this.apiUrl}/${id}`);
  }

  create(data: MechanicCreate): Observable<Mechanic> {
    return this.http.post<Mechanic>(this.apiUrl, data);
  }

  update(id: number, data: MechanicUpdate): Observable<Mechanic> {
    return this.http.patch<Mechanic>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
