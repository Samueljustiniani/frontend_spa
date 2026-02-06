import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    <!-- Hero Section con Promoción -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container position-relative">
        <div class="row align-items-center min-vh-80">
          <div class="col-lg-7">
            <h1 class="hero-title">Descubre el arte del bienestar</h1>
            <p class="hero-subtitle">
              Regálate el cuidado que mereces. Experimenta nuestros tratamientos exclusivos 
              y vive una experiencia de spa única que renovará tu energía.
            </p>
            <div class="d-flex gap-3 flex-wrap mt-4">
              <a routerLink="/cliente/reservar" class="btn btn-whatsapp btn-lg">
                <i class="material-icons me-2">calendar_month</i> Reservar Ahora
              </a>
              <a routerLink="/cliente/servicios" class="btn btn-outline-light btn-lg">
                Ver Servicios
              </a>
            </div>
          </div>
          <div class="col-lg-5 d-none d-lg-block">
            <div class="hero-image-container">
              <img src="/img/Spa%20prueba.jpg" alt="Spa Experience" class="hero-floating-img">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Características del Spa -->
    <section class="py-5 features-section">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <i class="material-icons">verified</i>
              </div>
              <h4>Calidad Premium</h4>
              <p>Contamos con ambientes privados y completamente equipados para ofrecerte un servicio de primera.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <i class="material-icons">auto_awesome</i>
              </div>
              <h4>Experiencias Únicas</h4>
              <p>Somos tu refugio del alma, un espacio donde puedes sanar, liberarte y consentirte como mereces.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <i class="material-icons">groups</i>
              </div>
              <h4>Personal Capacitado</h4>
              <p>Nuestras terapistas están altamente capacitadas para brindarte una experiencia de relajación única.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-5 bg-light services-section">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section-badge">Nuestros Tratamientos</span>
          <h2 class="section-title mt-2">Servicios Destacados</h2>
          <p class="section-subtitle">Descubre la experiencia completa de bienestar</p>
        </div>
        
        <div class="row g-4" *ngIf="!loadingServices">
          <div class="col-md-6 col-lg-4" *ngFor="let service of featuredServices">
            <div class="card service-card h-100">
              <div class="service-card-header">
                <span class="service-duration">{{ service.durationMinutes }} min</span>
              </div>
              <div class="card-body text-center">
                <div class="service-icon mb-3">
                  <i class="material-icons">spa</i>
                </div>
                <h5 class="card-title">{{ service.name }}</h5>
                <p class="card-text text-muted">{{ service.description || 'Servicio de relajación y bienestar' }}</p>
                <div class="service-price">S/. {{ service.price }}</div>
                <a [routerLink]="['/cliente/reservar']" [queryParams]="{serviceId: service.id}" 
                   class="btn btn-gradient-sm mt-3">
                  ¡Lo quiero!
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5">
          <a routerLink="/cliente/servicios" class="btn btn-gradient btn-lg px-5">
            <i class="material-icons me-2">visibility</i> Ver todos los servicios
          </a>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section-badge">Tienda</span>
          <h2 class="section-title mt-2">Productos Destacados</h2>
          <p class="section-subtitle">Los mejores productos para tu cuidado personal</p>
        </div>
        
        <div class="row g-4" *ngIf="!loadingProducts">
          <div class="col-6 col-md-4 col-lg-3" *ngFor="let product of featuredProducts">
            <div class="card product-card h-100">
              <div class="product-image">
                <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name">
                <i *ngIf="!product.imageUrl" class="material-icons no-image">inventory_2</i>
              </div>
              <div class="card-body text-center">
                <h6 class="card-title mb-2">{{ product.name }}</h6>
                <p class="product-price mb-0">S/. {{ product.price | number:'1.2-2' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5">
          <a routerLink="/cliente/productos" class="btn btn-gradient btn-lg px-5">
            Ver todos los productos
          </a>
        </div>
      </div>
    </section>

    <!-- Testimonios Section -->
    <section class="py-5 testimonials-section">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section-badge">Opiniones</span>
          <h2 class="section-title mt-2">Nuestros Clientes Dicen</h2>
        </div>
        
        <div class="row g-4">
          <div class="col-md-4" *ngFor="let testimonial of testimonials">
            <div class="testimonial-card">
              <div class="testimonial-rating">
                <i class="material-icons" *ngFor="let star of [1,2,3,4,5]">star</i>
              </div>
              <p class="testimonial-text">"{{ testimonial.text }}"</p>
              <div class="testimonial-author">
                <div class="author-avatar">{{ testimonial.initials }}</div>
                <div class="author-info">
                  <strong>{{ testimonial.name }}</strong>
                  <span>{{ testimonial.source }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reservas Section -->
    <section class="py-5 reservas-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 text-white mb-4 mb-lg-0">
            <h2 class="mb-3">¿Listo para tu momento de relajación?</h2>
            <p class="lead mb-4">Reserva tu cita hoy y experimenta el bienestar que mereces</p>
            <div class="contact-info">
              <div class="contact-item">
                <i class="material-icons">phone</i>
                <span>(01) 999-9999</span>
              </div>
              <div class="contact-item">
                <i class="material-icons">schedule</i>
                <span>Lun-Sáb: 9am - 9pm | Dom: 9am - 8pm</span>
              </div>
              <div class="contact-item">
                <i class="material-icons">location_on</i>
                <span>Av. Principal 123, Lima</span>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="reserva-card">
              <h4 class="mb-4 text-center">Reserva Ahora</h4>
              <p class="text-center text-muted mb-4">Contáctanos por WhatsApp para agendar tu cita</p>
              <a href="https://wa.me/51999999999?text=Hola,%20quiero%20reservar%20una%20cita" 
                 target="_blank" class="btn btn-whatsapp btn-lg w-100">
                <i class="material-icons me-2">chat</i> Contactar por WhatsApp
              </a>
              <div class="text-center mt-3">
                <small class="text-muted">Respuesta inmediata</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WhatsApp Floating Button - Dudas -->
    <a href="https://wa.me/51999999999?text=Hola,%20tengo%20una%20consulta" 
       target="_blank" class="whatsapp-float" title="¿Tienes dudas? Escríbenos">
      <i class="material-icons">help_outline</i>
      <span class="whatsapp-tooltip">¿Dudas?</span>
    </a>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #1a3a2e 0%, #2d5a47 100%);
      position: relative;
      overflow: hidden;
      padding: 80px 0;
    }
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/img/Spa%20prueba.jpg');
      background-size: cover;
      background-position: center;
      opacity: 0.15;
    }
    .min-vh-80 {
      min-height: 80vh;
    }
    .promo-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #1a1a1a;
      padding: 8px 20px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .promo-badge .material-icons {
      font-size: 18px;
    }
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      line-height: 1.2;
      margin-top: 20px;
    }
    .hero-subtitle {
      font-size: 1.2rem;
      color: rgba(255,255,255,0.85);
      margin-top: 20px;
      line-height: 1.7;
    }
    .hero-price-box {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px;
      padding: 20px 30px;
      display: inline-block;
      margin-top: 25px;
    }
    .price-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .price-label {
      color: rgba(255,255,255,0.7);
      font-size: 0.9rem;
    }
    .price-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #A4C3B2;
    }
    .price-detail {
      color: rgba(255,255,255,0.9);
    }
    .btn-whatsapp {
      background: linear-gradient(135deg, #25D366, #128C7E);
      color: white;
      border: none;
      border-radius: 50px;
      display: inline-flex;
      align-items: center;
    }
    .btn-whatsapp:hover {
      background: linear-gradient(135deg, #128C7E, #075E54);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4);
    }
    .hero-image-container {
      position: relative;
    }
    .hero-floating-img {
      width: 100%;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    /* Features Section */
    .features-section {
      background: white;
      margin-top: -50px;
      position: relative;
      z-index: 10;
    }
    .feature-card {
      background: white;
      padding: 40px 30px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
    }
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    }
    .feature-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .feature-icon .material-icons {
      font-size: 36px;
      color: white;
    }
    .feature-card h4 {
      color: #2d5a47;
      margin-bottom: 15px;
    }
    .feature-card p {
      color: #666;
      margin: 0;
    }

    /* Section Badges & Titles */
    .section-badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.15), rgba(164, 195, 178, 0.15));
      color: #6B9080;
      padding: 8px 20px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2d5a47;
    }
    .section-subtitle {
      color: #666;
      font-size: 1.1rem;
    }

    /* Service Cards */
    .service-card {
      border: none;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
    }
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }
    .service-card-header {
      background: linear-gradient(135deg, #6B9080, #A4C3B2);
      padding: 10px;
      text-align: right;
    }
    .service-duration {
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
    }
    .service-icon {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.15), rgba(164, 195, 178, 0.15));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    .service-icon .material-icons {
      font-size: 32px;
      color: #6B9080;
    }
    .service-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #6B9080;
    }
    .btn-gradient-sm {
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      color: white;
      border: none;
      border-radius: 25px;
      padding: 8px 25px;
      font-weight: 500;
    }
    .btn-gradient-sm:hover {
      color: white;
      box-shadow: 0 5px 15px rgba(107, 144, 128, 0.4);
    }
    .btn-gradient {
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 30px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
    }
    .btn-gradient:hover {
      color: white;
      box-shadow: 0 5px 20px rgba(107, 144, 128, 0.4);
      transform: translateY(-2px);
    }

    /* Product Cards */
    .product-card {
      border: none;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }
    .product-image {
      height: 180px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-image .no-image {
      font-size: 48px;
      color: #ccc;
    }
    .product-price {
      color: #6B9080;
      font-size: 1.2rem;
      font-weight: 700;
    }

    /* Testimonials */
    .testimonials-section {
      background: white;
    }
    .testimonial-card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 5px 30px rgba(0,0,0,0.08);
      height: 100%;
    }
    .testimonial-rating {
      margin-bottom: 15px;
    }
    .testimonial-rating .material-icons {
      color: #FFD700;
      font-size: 20px;
    }
    .testimonial-text {
      color: #555;
      font-style: italic;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .author-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6B9080, #A4C3B2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
    }
    .author-info {
      display: flex;
      flex-direction: column;
    }
    .author-info strong {
      color: #333;
    }
    .author-info span {
      color: #888;
      font-size: 0.85rem;
    }

    /* Reservas Section */
    .reservas-section {
      background: linear-gradient(135deg, #2d5a47 0%, #1a3a2e 100%);
    }
    .contact-info {
      margin-top: 30px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      color: rgba(255,255,255,0.9);
    }
    .contact-item .material-icons {
      color: #A4C3B2;
    }
    .reserva-card {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }

    /* WhatsApp Float */
    .whatsapp-float {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #25D366, #128C7E);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 5px 25px rgba(37, 211, 102, 0.5);
      z-index: 1000;
      animation: pulse 2s infinite;
    }
    .whatsapp-float .material-icons {
      color: white;
      font-size: 30px;
    }
    .whatsapp-float:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 35px rgba(37, 211, 102, 0.6);
    }
    .whatsapp-float .whatsapp-tooltip {
      position: absolute;
      right: 70px;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .whatsapp-float:hover .whatsapp-tooltip {
      opacity: 1;
      visibility: visible;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 5px 25px rgba(37, 211, 102, 0.5); }
      50% { box-shadow: 0 5px 35px rgba(37, 211, 102, 0.8); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.2rem;
      }
      .hero-subtitle {
        font-size: 1rem;
      }
      .section-title {
        font-size: 1.8rem;
      }
      .features-section {
        margin-top: 0;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredServices: ServiceEntity[] = [];
  featuredProducts: Product[] = [];
  loadingServices = true;
  loadingProducts = true;

  testimonials = [
    {
      name: 'María García',
      initials: 'MG',
      text: 'Excelente experiencia, el masaje fue increíble y el ambiente muy relajante. Definitivamente volveré.',
      source: 'Google Reviews'
    },
    {
      name: 'Carlos López',
      initials: 'CL',
      text: 'El mejor spa de la ciudad. Atención personalizada y profesionales muy capacitados. Súper recomendado.',
      source: 'Google Reviews'
    },
    {
      name: 'Ana Martínez',
      initials: 'AM',
      text: 'Fui por primera vez y quedé encantada. El trato es excelente y las instalaciones son hermosas.',
      source: 'Google Reviews'
    }
  ];

  constructor(
    private spaService: SpaServiceService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingServices = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts(): void {
    this.productService.listActivos().subscribe({
      next: (data) => {
        this.featuredProducts = data.slice(0, 8);
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingProducts = false;
        this.cdr.detectChanges();
      }
    });
  }
}
