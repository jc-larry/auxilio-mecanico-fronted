import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, RegisterRequest } from '../models/auth.models';
import { PaginatedUserResponse, UserUpdate } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'http://localhost:8000/api/v1/users';

  constructor(private http: HttpClient) {}

  list(page: number = 1, perPage: number = 10): Observable<PaginatedUserResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<PaginatedUserResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  update(id: number, data: UserUpdate): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePassword(id: number, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/password`, { new_password: newPassword });
  }
}
