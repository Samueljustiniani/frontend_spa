import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEntity } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpaServiceService {
  private readonly API_URL = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  list(): Observable<ServiceEntity[]> {
    return this.http.get<ServiceEntity[]>(this.API_URL);
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
