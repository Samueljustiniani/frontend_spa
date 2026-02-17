import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpaServiceService } from '../../core/services/spa-service.service';
import { ServiceEntity } from '../../core/interfaces/service.interface';
import { catchError, finalize, timeout, of } from 'rxjs';

@Component({
  selector: 'app-client-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Page Header -->
    <section class="page-header py-5 bg-light">
      <div class="container text-center">
        <h1 class="fw-bold">Nuestros Servicios</h1>
        <p class="text-muted lead">Descubre todos nuestros tratamientos de bienestar</p>
      </div>
    </section>

    <!-- Filters -->
    <section class="py-4">
      <div class="container">
        <div class="row g-3 align-items-center">
          <div class="col-md-4">
            <input type="text" class="form-control form-control-lg" 
                   placeholder="Buscar servicio..." [(ngModel)]="searchTerm">
          </div>
          <div class="col-md-4">
            <select class="form-select form-select-lg" [(ngModel)]="genderFilter" (change)="filterServices()">
              <option value="">Todos los géneros</option>
              <option value="U">Unisex</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div class="col-md-4 text-end">
            <span class="text-muted">{{ filteredServices.length }} servicios encontrados</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-4">
      <div class="container">
        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border" role="status" style="width: 3rem; height: 3rem; color: #6B9080;"></div>
          <p class="mt-3 text-muted">Cargando servicios...</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="!loading && errorMsg" class="alert alert-danger text-center" role="alert">
          {{ errorMsg }}
          <button class="btn btn-sm btn-outline-danger ms-2" (click)="loadServices()">Reintentar</button>
        </div>

        <!-- Services List -->
        <div class="row g-4" *ngIf="!loading && !errorMsg">
          <div class="col-md-6 col-lg-4" *ngFor="let service of filteredServices">
            <div class="card service-card h-100 border-0 shadow-sm">
              <!-- Imagen del servicio -->
              <div class="card-img-top service-image position-relative">
                <img *ngIf="service.imageUrl" [src]="service.imageUrl" [alt]="service.name"
                     class="w-100" style="height: 180px; object-fit: cover; border-radius: 16px 16px 0 0;">
                <div *ngIf="!service.imageUrl" class="w-100 d-flex align-items-center justify-content-center bg-light"
                     style="height: 180px; border-radius: 16px 16px 0 0;">
                  <i class="material-icons text-muted" style="font-size: 64px;">spa</i>
                </div>
                <span class="badge bg-light text-dark position-absolute top-0 end-0 m-2">{{ getGenderLabel(service.gender) }}</span>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ service.name }}</h5>
                <p class="card-text text-muted">{{ service.description || 'Servicio de relajación y bienestar profesional.' }}</p>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <i class="material-icons text-muted me-1" style="font-size: 16px; vertical-align: middle;">schedule</i>
                    <span class="text-muted">{{ service.durationMinutes }} min</span>
                  </div>
                  <span class="price fs-4">S/. {{ service.price | number:'1.2-2' }}</span>
                </div>
                <a [routerLink]="['/cliente/reservar']" [queryParams]="{serviceId: service.id}" class="btn btn-gradient w-100 mt-3">
                  Reservar
                </a>
              </div>
            </div>
          </div>

          <div class="col-12" *ngIf="filteredServices.length === 0">
            <div class="text-center py-5">
              <i class="material-icons text-muted" style="font-size: 64px;">search_off</i>
              <h5 class="mt-3">No se encontraron servicios</h5>
              <p class="text-muted">Intenta con otros filtros</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.15) 0%, rgba(164, 195, 178, 0.15) 100%);
    }
    .service-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .service-card {
      border-radius: 16px;
      transition: all 0.3s ease;
    }
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
    }
    .price {
      color: #6B9080;
      font-weight: 700;
    }
    .btn-gradient {
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      border: none;
      color: white;
      border-radius: 25px;
      padding: 10px 20px;
    }
    .btn-gradient:hover {
      color: white;
      box-shadow: 0 5px 15px rgba(107, 144, 128, 0.4);
    }
  `]
})
export class ClientServicesComponent implements OnInit {
  services: ServiceEntity[] = [];
  loading = false;
  errorMsg = '';
  searchTerm = '';
  genderFilter = '';

  constructor(
    private spaService: SpaServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.errorMsg = '';
    
    this.spaService.listActivos().pipe(
      timeout(10000),
      catchError((err) => {
        this.errorMsg = err.name === 'TimeoutError' 
          ? 'La carga está tardando demasiado. Intenta más tarde.'
          : 'Ocurrió un error al cargar los servicios.';
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((data) => {
      console.log('[ClientServices] Servicios recibidos:', data.length);
      this.services = data;
      this.cdr.detectChanges();
    });
  }

  filterServices(): void {
    // Filtering is done in the getter
  }

  get filteredServices(): ServiceEntity[] {
    let result = this.services;
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.description?.toLowerCase().includes(term)
      );
    }
    
    if (this.genderFilter) {
      result = result.filter(s => s.gender === this.genderFilter);
    }
    
    return result;
  }

  getGenderLabel(gender: string): string {
    switch (gender) {
      case 'M': return 'Masculino';
      case 'F': return 'Femenino';
      case 'U': return 'Unisex';
      default: return gender;
    }
  }
}
