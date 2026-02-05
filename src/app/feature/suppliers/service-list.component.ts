import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpaServiceService } from '../../core/services/spa-service.service';
import { ServiceEntity } from '../../core/interfaces/service.interface';
import { catchError, finalize, timeout, of } from 'rxjs';

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

  constructor(private spaService: SpaServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.errorMsg = '';
    
    const request$ = this.statusFilter 
      ? this.spaService.list(this.statusFilter)
      : this.spaService.list();

    request$.pipe(
      timeout(10000),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          this.errorMsg = 'La carga está tardando demasiado. Verifica tu conexión o intenta más tarde.';
        } else {
          this.errorMsg = 'Ocurrió un error al cargar los servicios.';
        }
        console.error('Error loading services:', err);
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data) => {
      this.services = data;
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
}
