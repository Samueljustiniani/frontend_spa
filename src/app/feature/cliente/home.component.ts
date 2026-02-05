import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpaServiceService } from '../../core/services/spa-service.service';
import { ProductService } from '../../core/services/product.service';
import { ServiceEntity } from '../../core/interfaces/service.interface';
import { Product } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center justify-content-center">
          <div class="col-lg-8 text-center">
            <h1>Bienvenido a tu espacio de bienestar</h1>
            <p class="lead mb-4">
              Descubre nuestros servicios exclusivos de spa y productos de belleza. 
              Tu momento de relajación te espera.
            </p>
            <div class="d-flex gap-3 flex-wrap justify-content-center">
              <a routerLink="/cliente/servicios" class="btn btn-light btn-lg px-4">
                Ver Servicios
              </a>
              <a routerLink="/auth/signup" class="btn btn-outline-light btn-lg px-4">
                Reservar Cita
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Nuestros Servicios</h2>
          <p class="text-muted">Descubre la experiencia completa de bienestar</p>
        </div>
        
        <div class="row g-4" *ngIf="!loadingServices">
          <div class="col-md-6 col-lg-4" *ngFor="let service of featuredServices">
            <div class="card service-card h-100">
              <div class="card-body text-center">
                <div class="service-icon mb-3">
                  <i class="material-icons" style="font-size: 48px; color: #6B9080;">spa</i>
                </div>
                <h5 class="card-title">{{ service.name }}</h5>
                <p class="card-text text-muted">{{ service.description || 'Servicio de relajación y bienestar' }}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <span class="badge bg-light text-dark">{{ service.durationMinutes }} min</span>
                  <span class="price">S/. {{ service.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-4">
          <a routerLink="/cliente/servicios" class="btn btn-gradient">
            Ver todos los servicios
          </a>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Productos Destacados</h2>
          <p class="text-muted">Los mejores productos para tu cuidado personal</p>
        </div>
        
        <div class="row g-4" *ngIf="!loadingProducts">
          <div class="col-6 col-md-4 col-lg-3" *ngFor="let product of featuredProducts">
            <div class="card product-card h-100">
              <div class="product-image">
                <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name">
                <i *ngIf="!product.imageUrl" class="material-icons no-image">inventory_2</i>
              </div>
              <div class="card-body">
                <h6 class="card-title mb-1">{{ product.name }}</h6>
                <p class="text-success fw-bold mb-0">S/. {{ product.price | number:'1.2-2' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-4">
          <a routerLink="/cliente/productos" class="btn btn-gradient">
            Ver todos los productos
          </a>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 text-white cta-section">
      <div class="container text-center">
        <h2 class="mb-3">¿Listo para tu momento de relajación?</h2>
        <p class="lead mb-4">Reserva tu cita hoy y experimenta el bienestar que mereces</p>
        <a routerLink="/cliente/servicios" class="btn btn-light btn-lg px-5">
          Reservar Ahora
        </a>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    .hero-section {
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.85) 0%, rgba(164, 195, 178, 0.85) 100%),
                  url('/img/Spa%20prueba.jpg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      width: 100%;
    }
    .service-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.15) 0%, rgba(164, 195, 178, 0.15) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    .service-icon .material-icons {
      color: #6B9080 !important;
    }
    .price {
      color: #6B9080;
      font-size: 1.25rem;
      font-weight: 700;
    }
    .cta-section {
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.9) 0%, rgba(164, 195, 178, 0.9) 100%),
                  url('/img/spa%202.jpg');
      background-size: cover;
      background-position: center;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredServices: ServiceEntity[] = [];
  featuredProducts: Product[] = [];
  loadingServices = true;
  loadingProducts = true;

  constructor(
    private spaService: SpaServiceService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadProducts();
  }

  loadServices(): void {
    this.spaService.listActivos().subscribe({
      next: (data) => {
        this.featuredServices = data.slice(0, 6);
        this.loadingServices = false;
      },
      error: () => this.loadingServices = false
    });
  }

  loadProducts(): void {
    this.productService.listActivos().subscribe({
      next: (data) => {
        this.featuredProducts = data.slice(0, 8);
        this.loadingProducts = false;
      },
      error: () => this.loadingProducts = false
    });
  }
}
