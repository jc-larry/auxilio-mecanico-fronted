import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InventoryItem,
  InventoryItemCreate,
  InventoryItemUpdate,
  InventoryStats,
  PaginatedResponse,
  RestockRequest,
} from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly apiUrl = 'http://localhost:8000/api/v1/inventory';

  constructor(private http: HttpClient) {}

  list(
    page: number = 1,
    perPage: number = 10,
    criticalOnly: boolean = false,
    category?: string,
  ): Observable<PaginatedResponse<InventoryItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (criticalOnly) {
      params = params.set('critical', 'true');
    }
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<PaginatedResponse<InventoryItem>>(this.apiUrl, { params });
  }

  getStats(): Observable<InventoryStats> {
    return this.http.get<InventoryStats>(`${this.apiUrl}/stats`);
  }

  create(data: InventoryItemCreate): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, data);
  }

  update(id: number, data: InventoryItemUpdate): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.apiUrl}/${id}`, data);
  }

  restock(id: number, quantity: number): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.apiUrl}/${id}/restock`, { quantity } as RestockRequest);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
