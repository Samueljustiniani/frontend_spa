import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEntity } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpaServiceService {
  private readonly API_URL = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  list(status?: string): Observable<ServiceEntity[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ServiceEntity[]>(this.API_URL, { params });
  }

  listActivos(): Observable<ServiceEntity[]> {
    return this.list('A');
  }

  listInactivos(): Observable<ServiceEntity[]> {
    return this.list('I');
  }

  getById(id: number): Observable<ServiceEntity> {
    return this.http.get<ServiceEntity>(`${this.API_URL}/${id}`);
  }

  create(service: ServiceEntity): Observable<ServiceEntity> {
    return this.http.post<ServiceEntity>(this.API_URL, service);
  }

  update(id: number, service: ServiceEntity): Observable<ServiceEntity> {
    return this.http.put<ServiceEntity>(`${this.API_URL}/${id}`, service);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
