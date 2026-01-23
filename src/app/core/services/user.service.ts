import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Listar usuarios activos
  list(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.API_URL);
  }

  // Listar usuarios inactivos
  listInactivos(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.API_URL}/inactivos`);
  }

  // Listar todos los usuarios
  listAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.API_URL}/all`);
  }

  // Obtener usuario por ID
  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.API_URL}/${id}`);
  }

  // Crear usuario
  create(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.API_URL, user);
  }

  // Actualizar usuario
  update(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.API_URL}/${id}`, user);
  }

  // Eliminar usuario (soft delete)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Reactivar usuario
  reactivate(id: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.API_URL}/${id}/reactivar`, {});
  }
}
