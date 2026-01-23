import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleRequest, SaleResponse } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SaleService {
  private readonly API_URL = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  list(): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(this.API_URL);
  }

  getById(id: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(`${this.API_URL}/${id}`);
  }

  getByUserId(userId: number): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(`${this.API_URL}/user/${userId}`);
  }

  create(sale: SaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.API_URL, sale);
  }

  updateStatus(id: number, status: string): Observable<SaleResponse> {
    return this.http.patch<SaleResponse>(`${this.API_URL}/${id}/status`, { status });
  }

  cancel(id: number): Observable<SaleResponse> {
    return this.http.patch<SaleResponse>(`${this.API_URL}/${id}/cancel`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
