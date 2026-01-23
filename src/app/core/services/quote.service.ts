import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuoteRequest, QuoteResponse } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly API_URL = `${environment.apiUrl}/quotes`;

  constructor(private http: HttpClient) {}

  list(): Observable<QuoteResponse[]> {
    return this.http.get<QuoteResponse[]>(this.API_URL);
  }

  getById(id: number): Observable<QuoteResponse> {
    return this.http.get<QuoteResponse>(`${this.API_URL}/${id}`);
  }

  getByUserId(userId: number): Observable<QuoteResponse[]> {
    return this.http.get<QuoteResponse[]>(`${this.API_URL}/user/${userId}`);
  }

  getByDate(date: string): Observable<QuoteResponse[]> {
    return this.http.get<QuoteResponse[]>(`${this.API_URL}/date/${date}`);
  }

  checkAvailability(roomId: number, date: string, startTime: string, endTime: string): Observable<boolean> {
    const params = new HttpParams()
      .set('roomId', roomId.toString())
      .set('date', date)
      .set('startTime', startTime)
      .set('endTime', endTime);
    return this.http.get<boolean>(`${this.API_URL}/availability`, { params });
  }

  create(quote: QuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(this.API_URL, quote);
  }

  updateStatus(id: number, status: string): Observable<QuoteResponse> {
    return this.http.patch<QuoteResponse>(`${this.API_URL}/${id}/status`, { status });
  }

  cancel(id: number): Observable<QuoteResponse> {
    return this.http.patch<QuoteResponse>(`${this.API_URL}/${id}/cancel`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
