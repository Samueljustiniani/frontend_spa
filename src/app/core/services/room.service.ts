import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly API_URL = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  list(): Observable<Room[]> {
    return this.http.get<Room[]>(this.API_URL);
  }

  getById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.API_URL}/${id}`);
  }

  create(room: Room): Observable<Room> {
    return this.http.post<Room>(this.API_URL, room);
  }

  update(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.API_URL}/${id}`, room);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
