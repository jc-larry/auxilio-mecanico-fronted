import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardAnalytics } from '../models/analytics.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<DashboardAnalytics> {
    return this.http.get<DashboardAnalytics>(this.apiUrl);
  }
}
