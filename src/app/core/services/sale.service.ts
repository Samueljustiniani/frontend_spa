import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { SaleRequest, SaleResponse } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SaleService {
  private readonly API_URL = `${environment.apiUrl}/sales`;
  private readonly TIMEOUT = 30000; // 30 segundos

  constructor(private http: HttpClient) {}

  list(): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(this.API_URL).pipe(timeout(this.TIMEOUT));
  }

  getById(id: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(`${this.API_URL}/${id}`).pipe(timeout(this.TIMEOUT));
  }

  getByUserId(userId: number): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(`${this.API_URL}/user/${userId}`).pipe(timeout(this.TIMEOUT));
  }

  create(sale: SaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.API_URL, sale).pipe(timeout(this.TIMEOUT));
  }

  updateStatus(id: number, status: string): Observable<SaleResponse> {
    return this.http.patch<SaleResponse>(`${this.API_URL}/${id}/status`, { status }).pipe(timeout(this.TIMEOUT));
  }

  cancel(id: number): Observable<SaleResponse> {
    return this.http.patch<SaleResponse>(`${this.API_URL}/${id}/cancel`, {}).pipe(timeout(this.TIMEOUT));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(timeout(this.TIMEOUT));
  }
}
