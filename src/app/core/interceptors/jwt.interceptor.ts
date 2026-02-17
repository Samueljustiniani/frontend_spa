import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Clonar la request y agregar el header Authorization si hay token
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // No aplicar timeout corto a las peticiones de subida de imágenes
    const isImageUpload = req.url.includes('/images/upload');
    const timeoutMs = isImageUpload ? 120000 : 15000; // 2 min para imágenes, 15s para el resto

    console.log(`[HTTP] ${req.method} ${req.url}`, token ? '(con token)' : '(sin token)');

    return next.handle(authReq).pipe(
      timeout(timeoutMs),
      catchError((error: HttpErrorResponse | Error) => {
        if (error instanceof HttpErrorResponse) {
          console.error(`[HTTP Error] ${req.url}:`, error.status, error.message);
          if (error.status === 401) {
            // Token expirado o inválido
            this.authService.logout();
            this.router.navigate(['/auth/signin']);
          }
        } else if (error.name === 'TimeoutError') {
          console.error(`[HTTP Timeout] ${req.url}: La petición tardó más de ${timeoutMs/1000} segundos`);
        } else {
          console.error(`[HTTP Error] ${req.url}:`, error);
        }
        return throwError(() => error);
      })
    );
  }
}
