import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthRequest, AuthResponse, User } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private tokenKey = 'spa_token';
  private userKey = 'spa_user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  register(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, user);
  }

  // Obtener datos del usuario autenticado desde el backend
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`).pipe(
      tap(user => {
        this.setCurrentUser(user);
      })
    );
  }

  // Guardar usuario en localStorage y BehaviorSubject
  setCurrentUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Obtener el usuario actual de forma sincrónica
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // Verificar si el token no ha expirado (decodificar JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Cargar usuario desde localStorage al iniciar
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr && this.isAuthenticated()) {
      try {
        const user = JSON.parse(userStr) as User;
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    } else if (this.isAuthenticated()) {
      // Si hay token pero no hay user guardado, obtenerlo del backend
      this.getCurrentUser().subscribe({
        error: () => this.logout()
      });
    }
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    if (user?.role) return user.role;
    
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }

  getCurrentUserId(): number | null {
    const user = this.currentUserSubject.value;
    if (user?.id) return user.id;
    
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  }
}
