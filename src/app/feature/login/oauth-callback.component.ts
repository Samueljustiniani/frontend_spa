import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">{{ message }}</p>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .spinner-border {
      width: 3rem;
      height: 3rem;
      border-color: white;
      border-right-color: transparent;
    }
  `]
})
export class OAuthCallbackComponent implements OnInit {
  message = 'Procesando autenticación...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el token de los query params
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (token) {
        this.processToken(token);
      } else {
        // Si no hay token, revisar si viene en la URL como fragment
        const fragment = this.route.snapshot.fragment;
        if (fragment) {
          const urlParams = new URLSearchParams(fragment);
          const fragmentToken = urlParams.get('token');
          if (fragmentToken) {
            this.processToken(fragmentToken);
            return;
          }
        }
        
        // Sin token, redirigir al login
        this.message = 'No se encontró token. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/auth/signin']), 1500);
      }
    });
  }

  private processToken(token: string): void {
    // Guardar el token
    this.authService.setToken(token);
    this.message = 'Obteniendo información del usuario...';

    // Obtener datos del usuario desde el backend
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.message = `¡Bienvenido, ${user.name || user.email}!`;
        // Redirigir al dashboard después de un momento
        setTimeout(() => this.router.navigate(['/dashboard']), 500);
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
        // Aún así redirigir al dashboard, el usuario se cargará después
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
