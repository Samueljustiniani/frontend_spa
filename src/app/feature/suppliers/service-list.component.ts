import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpaServiceService } from '../../core/services/spa-service.service';
import { ServiceEntity } from '../../core/interfaces/service.interface';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  services: ServiceEntity[] = [];
  loading = false;
  errorMsg = '';
  searchTerm = '';
  statusFilter = ''; // '', 'A', 'I'
  showImageModal = false;
  selectedImageUrl = '';
  selectedImageName = '';

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
    this.cdr.detectChanges();
    
    console.log('[ServiceList] Cargando servicios con filtro:', this.statusFilter || 'todos');
    
    const request$ = this.statusFilter 
      ? this.spaService.list(this.statusFilter)
      : this.spaService.list();

    request$.pipe(
      catchError((err) => {
        console.error('[ServiceList] Error:', err);
        if (err.name === 'TimeoutError') {
          this.errorMsg = 'La carga está tardando demasiado. Verifica tu conexión o intenta más tarde.';
        } else if (err.status === 401) {
          this.errorMsg = 'No tienes autorización. Por favor inicia sesión nuevamente.';
        } else if (err.status === 0) {
          this.errorMsg = 'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.';
        } else {
          this.errorMsg = `Error al cargar los servicios: ${err.message || err.statusText || 'Error desconocido'}`;
        }
        this.loading = false;
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        console.log('[ServiceList] Petición completada');
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((data) => {
      console.log('[ServiceList] Datos recibidos:', data.length, 'servicios');
      this.services = data;
      this.cdr.detectChanges();
    });
  }

  onFilterChange(): void {
    this.loadServices();
  }

  get filteredServices(): ServiceEntity[] {
    if (!this.searchTerm) return this.services;
    const term = this.searchTerm.toLowerCase();
    return this.services.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.description?.toLowerCase().includes(term)
    );
  }

  getGenderLabel(gender: string): string {
    switch (gender) {
      case 'M': return 'Masculino';
      case 'F': return 'Femenino';
      case 'U': return 'Unisex';
      default: return gender;
    }
  }

  deleteService(id: number): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.spaService.delete(id).subscribe({
        next: () => this.loadServices(),
        error: (err) => console.error('Error deleting service:', err)
      });
    }
  }

  viewImage(service: ServiceEntity): void {
    if (service.imageUrl) {
      this.selectedImageUrl = service.imageUrl;
      this.selectedImageName = service.name;
      this.showImageModal = true;
    }
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImageUrl = '';
    this.selectedImageName = '';
  }
}
