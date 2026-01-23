import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpaServiceService } from '../../core/services/spa-service.service';
import { ServiceEntity } from '../../core/interfaces/service.interface';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  services: ServiceEntity[] = [];
  loading = false;

  constructor(private spaService: SpaServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.spaService.list().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.loading = false;
      }
    });
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
