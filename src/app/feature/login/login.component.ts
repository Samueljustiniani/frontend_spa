import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  error = '';
  returnUrl = '/admin/dashboard';
  
  // Carrusel de imágenes
  images = [
    { url: '/img/spa1.jpg', alt: 'Spa ambiente relajante' },
    { url: '/img/spa2.jpg', alt: 'Tratamientos de belleza' },
    { url: '/img/spa3.jpg', alt: 'Masajes terapéuticos' },
    { url: '/img/spa4.jpg', alt: 'Sala de relajación' },
    { url: '/img/spa5.jpg', alt: 'Aromaterapia' },
    { url: '/img/spa6.jpg', alt: 'Tratamientos faciales' },
    { url: '/img/spa7.jpg', alt: 'Bienestar y salud' },
    { url: '/img/spa8.jpg', alt: 'Experiencia spa' },
    { url: '/img/spa9.jpg', alt: 'Cuidado personal' },
    { url: '/img/spa10.jpg', alt: 'Relajación profunda' }
  ];
  currentSlide = 0;
  private slideInterval: any;

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

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.images.length;
    }, 5000);
  }

  stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.stopSlideshow();
    this.startSlideshow();
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
