import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { UserDTO } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;
  private readonly TIMEOUT = 30000; // 30 segundos

  constructor(private http: HttpClient) {}

  // Listar usuarios activos
  list(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.API_URL).pipe(timeout(this.TIMEOUT));
  }

  // Listar usuarios inactivos
  listInactivos(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.API_URL}/inactivos`).pipe(timeout(this.TIMEOUT));
  }

  // Listar todos los usuarios
  listAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.API_URL}/all`).pipe(timeout(this.TIMEOUT));
  }

  // Obtener usuario por ID
  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.API_URL}/${id}`).pipe(timeout(this.TIMEOUT));
  }

  // Crear usuario
  create(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.API_URL, user).pipe(timeout(this.TIMEOUT));
  }

  // Actualizar usuario
  update(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.API_URL}/${id}`, user).pipe(timeout(this.TIMEOUT));
  }

  // Eliminar usuario (soft delete)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(timeout(this.TIMEOUT));
  }

  // Reactivar usuario
  reactivate(id: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.API_URL}/${id}/reactivar`, {}).pipe(timeout(this.TIMEOUT));
  }
}
