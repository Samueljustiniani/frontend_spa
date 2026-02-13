import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <!-- Lado izquierdo - Carrusel de imágenes -->
      <div class="register-image-side">
        <div class="image-slider">
          <div class="slide" *ngFor="let img of images; let i = index" 
               [class.active]="currentSlide === i">
            <img [src]="img.url" [alt]="img.alt">
            <div class="slide-overlay"></div>
          </div>
        </div>
        <div class="image-content">
          <div class="brand">
            <img src="/img/logo-spa.jpg" alt="SPA Logo" class="brand-logo">
            <h1>SPA & Wellness</h1>
          </div>
          <div class="tagline">
            <h2>Únete a nuestra comunidad</h2>
            <p>Crea tu cuenta y accede a beneficios exclusivos, promociones y reservas prioritarias</p>
          </div>
          <div class="benefits">
            <div class="benefit-item">
              <i class="material-icons">card_giftcard</i>
              <span>Descuentos exclusivos</span>
            </div>
            <div class="benefit-item">
              <i class="material-icons">event_available</i>
              <span>Reservas prioritarias</span>
            </div>
            <div class="benefit-item">
              <i class="material-icons">loyalty</i>
              <span>Programa de puntos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lado derecho - Formulario -->
      <div class="register-form-side">
        <div class="form-wrapper">
          <div class="form-header">
            <h3>Crear Cuenta</h3>
            <p>Completa tus datos para registrarte</p>
          </div>

          <div class="alert alert-danger" *ngIf="error">
            <i class="material-icons">error_outline</i>
            {{ error }}
          </div>
          
          <div class="alert alert-success" *ngIf="success">
            <i class="material-icons">check_circle</i>
            {{ success }}
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="material-icons">person</i>
                  Nombre
                </label>
                <input type="text" class="form-control" formControlName="name" 
                       placeholder="Tu nombre"
                       [class.is-invalid]="isInvalid('name')">
                <div class="invalid-feedback">El nombre es requerido</div>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <i class="material-icons">person_outline</i>
                  Apellido
                </label>
                <input type="text" class="form-control" formControlName="lastname" 
                       placeholder="Tu apellido">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="material-icons">email</i>
                Correo electrónico
              </label>
              <input type="email" class="form-control" formControlName="email" 
                     placeholder="correo@ejemplo.com"
                     [class.is-invalid]="isInvalid('email')">
              <div class="invalid-feedback">Ingrese un email válido</div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="material-icons">phone</i>
                Teléfono
              </label>
              <input type="tel" class="form-control" formControlName="phone" 
                     placeholder="+51 999 999 999">
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="material-icons">lock</i>
                Contraseña
              </label>
              <input type="password" class="form-control" formControlName="password"
                     placeholder="Mínimo 6 caracteres"
                     [class.is-invalid]="isInvalid('password')">
              <div class="invalid-feedback">La contraseña debe tener al menos 6 caracteres</div>
            </div>

            <button type="submit" class="btn-register" [disabled]="loading">
              <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
              <span *ngIf="!loading">Crear mi cuenta</span>
              <span *ngIf="loading">Registrando...</span>
            </button>
          </form>

          <div class="login-link">
            <p>¿Ya tienes cuenta? <a routerLink="/auth/signin">Inicia sesión</a></p>
          </div>

          <div class="back-home">
            <a routerLink="/">
              <i class="material-icons">arrow_back</i>
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }

    .register-image-side {
      flex: 1;
      position: relative;
      overflow: hidden;
      display: none;
      
      @media (min-width: 992px) {
        display: block;
      }
    }

    .image-slider {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      
      .slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 1s ease-in-out;
        
        &.active { opacity: 1; }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .slide-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(107, 144, 128, 0.9) 0%, rgba(45, 90, 71, 0.95) 100%);
      }
    }

    .image-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px;
      color: white;
      z-index: 10;
      
      .brand {
        display: flex;
        align-items: center;
        gap: 15px;
        
        .brand-logo {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          object-fit: cover;
        }
        
        h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }
      }
      
      .tagline {
        text-align: center;
        
        h2 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        
        p {
          font-size: 1rem;
          opacity: 0.9;
          max-width: 350px;
          margin: 0 auto;
        }
      }
      
      .benefits {
        display: flex;
        justify-content: center;
        gap: 30px;
        
        .benefit-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          
          .material-icons {
            font-size: 28px;
            background: rgba(255,255,255,0.2);
            padding: 12px;
            border-radius: 50%;
          }
          
          span {
            font-size: 0.85rem;
            opacity: 0.9;
          }
        }
      }
    }

    .register-form-side {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: white;
      
      @media (min-width: 992px) {
        max-width: 550px;
      }
    }

    .form-wrapper {
      width: 100%;
      max-width: 450px;
    }

    .form-header {
      text-align: center;
      margin-bottom: 30px;
      
      h3 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #2d5a47;
        margin-bottom: 10px;
      }
      
      p {
        color: #666;
        font-size: 0.95rem;
      }
    }

    .register-form {
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        
        @media (max-width: 576px) {
          grid-template-columns: 1fr;
        }
      }
      
      .form-group {
        margin-bottom: 18px;
      }
      
      .form-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
        font-size: 0.9rem;
        
        .material-icons {
          font-size: 18px;
          color: #6B9080;
        }
      }
      
      .form-control {
        width: 100%;
        padding: 12px 14px;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        font-size: 14px;
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: #6B9080;
          box-shadow: 0 0 0 3px rgba(107, 144, 128, 0.1);
        }
        
        &.is-invalid {
          border-color: #dc3545;
        }
      }
      
      .invalid-feedback {
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 5px;
      }
    }

    .btn-register {
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #6B9080 0%, #2d5a47 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(107, 144, 128, 0.4);
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .login-link {
      text-align: center;
      margin-top: 25px;
      
      p {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
        
        a {
          color: #6B9080;
          font-weight: 600;
          text-decoration: none;
          
          &:hover { text-decoration: underline; }
        }
      }
    }

    .back-home {
      text-align: center;
      margin-top: 15px;
      
      a {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #999;
        text-decoration: none;
        font-size: 0.85rem;
        
        .material-icons { font-size: 18px; }
        
        &:hover { color: #6B9080; }
      }
    }

    .alert-danger, .alert-success {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      
      .material-icons { font-size: 20px; }
    }
    
    .alert-danger {
      background: #fff5f5;
      border: 1px solid #fed7d7;
      color: #c53030;
    }
    
    .alert-success {
      background: #f0fff4;
      border: 1px solid #9ae6b4;
      color: #276749;
    }

    @media (max-width: 991px) {
      .register-form-side {
        background: linear-gradient(135deg, rgba(107, 144, 128, 0.05) 0%, rgba(164, 195, 178, 0.1) 100%);
      }
      
      .form-wrapper {
        background: white;
        padding: 35px 25px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      }
    }

    @media (max-width: 576px) {
      .register-form-side {
        padding: 20px 15px;
      }
      
      .form-wrapper {
        padding: 25px 20px;
      }
      
      .form-header h3 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';
  
  images = [
    { url: '/img/spa1.jpg', alt: 'Spa ambiente' },
    { url: '/img/spa3.jpg', alt: 'Tratamientos' },
    { url: '/img/spa5.jpg', alt: 'Relajación' },
    { url: '/img/spa7.jpg', alt: 'Bienestar' },
    { url: '/img/spa9.jpg', alt: 'Cuidado personal' }
  ];
  currentSlide = 0;
  private slideInterval: any;

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

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.images.length;
    }, 4000);
  }

  stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
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
