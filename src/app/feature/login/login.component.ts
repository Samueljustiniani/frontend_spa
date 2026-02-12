import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  returnUrl = '/admin/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
        // Después del login, obtener los datos del usuario
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            // Redirigir según el rol del usuario
            if (user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: () => {
            // Si no se puede obtener el usuario, ir a home
            this.router.navigate(['/']);
          }
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }

  loginWithGoogle(): void {
    // Redirigir al endpoint de Google OAuth2 del backend
    window.location.href = 'https://backend-spas.onrender.com/oauth2/authorization/google';
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
