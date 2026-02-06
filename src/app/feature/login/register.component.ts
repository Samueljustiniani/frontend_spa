import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-content">
        <div class="card">
          <div class="card-body text-center">
            <div class="mb-4">
              <i class="material-icons auth-icon" style="font-size: 72px; color: #6B9080;">person_add</i>
            </div>
            <h3 class="mb-4">Crear Cuenta</h3>

            <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
            <div *ngIf="success" class="alert alert-success">{{ success }}</div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" formControlName="name">
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label class="form-label">Apellido</label>
                  <input type="text" class="form-control" formControlName="lastname">
                </div>
              </div>

              <div class="mb-3 text-start">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" formControlName="email">
              </div>

              <div class="mb-3 text-start">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-control" formControlName="phone">
              </div>

              <div class="mb-4 text-start">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" formControlName="password">
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                Registrarme
              </button>
            </form>

            <p class="mb-0 text-muted">
              ¿Ya tienes cuenta? <a routerLink="/auth/signin">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.success = 'Cuenta creada exitosamente. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/auth/signin']), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar';
        this.loading = false;
      }
    });
  }
}
