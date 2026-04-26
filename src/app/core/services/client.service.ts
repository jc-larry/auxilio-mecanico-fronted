import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedClientResponse } from '../models/client.models';
import { Vehicle } from '../models/vehicle.models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly apiUrl = 'http://localhost:8000/api/v1/clients';

  constructor(private http: HttpClient) {}

  list(page: number = 1, perPage: number = 50): Observable<PaginatedClientResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<PaginatedClientResponse>(this.apiUrl, { params });
  }

  getVehicles(clientId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/${clientId}/vehicles`);
  }
}
