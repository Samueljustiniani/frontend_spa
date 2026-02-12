import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { QuoteRequest, QuoteResponse } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly API_URL = `${environment.apiUrl}/quotes`;
  private readonly TIMEOUT = 30000; // 30 segundos

  constructor(private http: HttpClient) {}

  list(): Observable<QuoteResponse[]> {
    return this.http.get<QuoteResponse[]>(this.API_URL).pipe(timeout(this.TIMEOUT));
  }

  getById(id: number): Observable<QuoteResponse> {
    return this.http.get<QuoteResponse>(`${this.API_URL}/${id}`).pipe(timeout(this.TIMEOUT));
  }

  getByUserId(userId: number): Observable<QuoteResponse[]> {
    return this.http.get<QuoteResponse[]>(`${this.API_URL}/user/${userId}`).pipe(timeout(this.TIMEOUT));
  }

  getByDate(date: string): Observable<QuoteResponse[]> {
    return this.http.get<QuoteResponse[]>(`${this.API_URL}/date/${date}`).pipe(timeout(this.TIMEOUT));
  }

  checkAvailability(roomId: number, date: string, startTime: string, endTime: string): Observable<boolean> {
    const params = new HttpParams()
      .set('roomId', roomId.toString())
      .set('date', date)
      .set('startTime', startTime)
      .set('endTime', endTime);
    return this.http.get<boolean>(`${this.API_URL}/availability`, { params }).pipe(timeout(this.TIMEOUT));
  }

  create(quote: QuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(this.API_URL, quote).pipe(timeout(this.TIMEOUT));
  }

  update(id: number, quote: QuoteRequest): Observable<QuoteResponse> {
    return this.http.put<QuoteResponse>(`${this.API_URL}/${id}`, quote).pipe(timeout(this.TIMEOUT));
  }

  updateStatus(id: number, status: string): Observable<QuoteResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<QuoteResponse>(`${this.API_URL}/${id}/status`, null, { params }).pipe(timeout(this.TIMEOUT));
  }

  cancel(id: number): Observable<QuoteResponse> {
    return this.updateStatus(id, 'C');
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(timeout(this.TIMEOUT));
  }
}
