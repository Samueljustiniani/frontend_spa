import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkSchedule } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkScheduleService {
  private readonly API_URL = `${environment.apiUrl}/work-schedule`;

  constructor(private http: HttpClient) {}

  list(): Observable<WorkSchedule[]> {
    return this.http.get<WorkSchedule[]>(this.API_URL);
  }

  getById(id: number): Observable<WorkSchedule> {
    return this.http.get<WorkSchedule>(`${this.API_URL}/${id}`);
  }

  getByDayOfWeek(dayOfWeek: string): Observable<WorkSchedule> {
    return this.http.get<WorkSchedule>(`${this.API_URL}/day/${dayOfWeek}`);
  }

  create(schedule: WorkSchedule): Observable<WorkSchedule> {
    return this.http.post<WorkSchedule>(this.API_URL, schedule);
  }

  update(id: number, schedule: WorkSchedule): Observable<WorkSchedule> {
    return this.http.put<WorkSchedule>(`${this.API_URL}/${id}`, schedule);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  activate(id: number): Observable<WorkSchedule> {
    return this.http.patch<WorkSchedule>(`${this.API_URL}/${id}/activate`, {});
  }

  inactivate(id: number): Observable<WorkSchedule> {
    return this.http.patch<WorkSchedule>(`${this.API_URL}/${id}/inactivate`, {});
  }
}
