import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuoteService } from '../../core/services/quote.service';
import { AuthService } from '../../core/services/auth.service';
import { QuoteResponse } from '../../core/interfaces/quote.interface';
import { catchError, finalize, timeout, of } from 'rxjs';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Page Header -->
    <section class="page-header py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="fw-bold">Mis Citas</h1>
            <p class="text-muted lead mb-0">Gestiona tus reservas y citas programadas</p>
          </div>
          <div class="col-md-4 text-md-end mt-3 mt-md-0">
            <a routerLink="/cliente/reservar" class="btn btn-gradient">
              <i class="material-icons me-1" style="font-size: 18px; vertical-align: middle;">add</i>
              Nueva Cita
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-5">
      <div class="container">
        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border" role="status" style="width: 3rem; height: 3rem; color: #6B9080;"></div>
          <p class="mt-3 text-muted">Cargando tus citas...</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="!loading && errorMsg" class="alert alert-danger text-center" role="alert">
          {{ errorMsg }}
          <button class="btn btn-sm btn-outline-danger ms-2" (click)="loadAppointments()">Reintentar</button>
        </div>

        <!-- Appointments List -->
        <div *ngIf="!loading && !errorMsg">
          <!-- Upcoming Appointments -->
          <div class="mb-5" *ngIf="upcomingAppointments.length > 0">
            <h4 class="mb-4">
              <i class="material-icons me-2 text-primary" style="vertical-align: middle;">event_available</i>
              Próximas Citas
            </h4>
            <div class="row g-4">
              <div class="col-md-6 col-lg-4" *ngFor="let quote of upcomingAppointments">
                <div class="card appointment-card border-0 shadow-sm h-100">
                  <div class="card-header bg-primary text-white">
                    <div class="d-flex justify-content-between align-items-center">
                      <span>{{ quote.quoteDate | date:'dd MMM yyyy' }}</span>
                      <span class="badge bg-light text-primary">{{ getStatusLabel(quote.status) }}</span>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="mb-3">
                      <i class="material-icons me-2 text-muted" style="font-size: 18px; vertical-align: middle;">schedule</i>
                      <strong>{{ quote.startTime }} - {{ quote.endTime }}</strong>
                    </div>
                    <div class="mb-3">
                      <i class="material-icons me-2 text-muted" style="font-size: 18px; vertical-align: middle;">spa</i>
                      <span>{{ quote.serviceNames.join(', ') || 'Servicio' }}</span>
                    </div>
                    <div class="mb-3">
                      <i class="material-icons me-2 text-muted" style="font-size: 18px; vertical-align: middle;">meeting_room</i>
                      <span>{{ quote.roomName || 'Sala' }}</span>
                    </div>
                  </div>
                  <div class="card-footer bg-white border-top">
                    <div class="d-flex gap-2 flex-wrap">
                      <a [routerLink]="['/cliente/reservar']" [queryParams]="{editId: quote.id}"
                         class="btn btn-outline-primary btn-sm"
                         *ngIf="quote.status === 'P' || quote.status === 'PENDIENTE'">
                        <i class="material-icons" style="font-size: 16px; vertical-align: middle;">edit</i> Modificar
                      </a>
                      <button class="btn btn-outline-success btn-sm" (click)="openWhatsApp('Hola, quiero confirmar mi cita en el spa. Mi código de cita es: #' + quote.id)"
                              *ngIf="quote.status === 'P' || quote.status === 'PENDIENTE'">
                        <i class="material-icons" style="font-size: 16px; vertical-align: middle;">check_circle</i> Confirmar por WhatsApp
                      </button>
                      <button class="btn btn-outline-danger btn-sm" (click)="cancelAppointment(quote)"
                              *ngIf="quote.status === 'P' || quote.status === 'PENDIENTE' || quote.status === 'CONFIRMADA'">
                        <i class="material-icons" style="font-size: 16px; vertical-align: middle;">close</i> Cancelar
                      </button>
                      <!-- Botón Reactivar solo visible para admin, no para cliente -->
                      <!-- Botón WhatsApp general eliminado, solo queda 'Confirmar por WhatsApp' -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Past Appointments -->
          <div *ngIf="pastAppointments.length > 0">
            <h4 class="mb-4">
              <i class="material-icons me-2 text-muted" style="vertical-align: middle;">history</i>
              Historial de Citas
            </h4>
            <div class="row g-4">
              <div class="col-md-6 col-lg-4" *ngFor="let quote of pastAppointments">
                <div class="card appointment-card border-0 shadow-sm h-100 opacity-75">
                  <div class="card-header bg-secondary text-white">
                    <div class="d-flex justify-content-between align-items-center">
                      <span>{{ quote.quoteDate | date:'dd MMM yyyy' }}</span>
                      <span class="badge bg-light text-secondary">{{ getStatusLabel(quote.status) }}</span>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="mb-2">
                      <i class="material-icons me-2 text-muted" style="font-size: 18px; vertical-align: middle;">schedule</i>
                      {{ quote.startTime }} - {{ quote.endTime }}
                    </div>
                    <div class="mb-2">
                      <i class="material-icons me-2 text-muted" style="font-size: 18px; vertical-align: middle;">spa</i>
                      {{ quote.serviceNames.join(', ') || 'Servicio' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Appointments -->
          <div *ngIf="appointments.length === 0" class="text-center py-5">
            <i class="material-icons text-muted" style="font-size: 80px;">event_busy</i>
            <h4 class="mt-4">No tienes citas registradas</h4>
            <p class="text-muted mb-4">¡Reserva tu primera cita y disfruta de nuestros servicios!</p>
            <a routerLink="/cliente/reservar" class="btn btn-gradient btn-lg">
              Ver Servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.15) 0%, rgba(164, 195, 178, 0.15) 100%);
    }
    .appointment-card {
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .appointment-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    .btn-gradient {
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      border: none;
      color: white;
      border-radius: 25px;
      padding: 10px 25px;
    }
    .btn-gradient:hover {
      color: white;
      box-shadow: 0 5px 15px rgba(107, 144, 128, 0.4);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        padding: 2rem 0 !important;
      }
      .page-header h1 {
        font-size: 1.6rem;
      }
      .page-header p {
        font-size: 0.9rem;
      }
      .appointment-card .card-body {
        padding: 15px;
      }
      .appointment-card .card-footer {
        padding: 12px;
      }
      .d-flex.gap-2 {
        gap: 8px !important;
      }
      .btn-sm {
        padding: 6px 10px;
        font-size: 12px;
      }
      h4 {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 480px) {
      .page-header h1 {
        font-size: 1.4rem;
      }
      .btn-gradient {
        padding: 8px 20px;
        font-size: 14px;
      }
      .card-header {
        padding: 12px;
      }
      .appointment-card .card-body {
        padding: 12px;
      }
      .d-flex.gap-2.flex-wrap {
        justify-content: center;
      }
    }
  `]
})
export class MyAppointmentsComponent implements OnInit {
  appointments: QuoteResponse[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private quoteService: QuoteService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.errorMsg = '';
    
    const user = this.authService.getCurrentUserValue();
    if (!user?.id) {
      this.loading = false;
      this.errorMsg = 'No se pudo obtener la información del usuario.';
      return;
    }

    this.quoteService.getByUserId(user.id).pipe(
      timeout(10000),
      catchError((err) => {
        this.errorMsg = err.name === 'TimeoutError' 
          ? 'La carga está tardando demasiado. Intenta más tarde.'
          : 'Ocurrió un error al cargar tus citas.';
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((data) => {
      console.log('[MyAppointments] Citas recibidas:', data.length);
      this.appointments = data;
      this.cdr.detectChanges();
    });
  }

  get upcomingAppointments(): QuoteResponse[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(q => 
      q.quoteDate >= today && 
      (q.status === 'P' || q.status === 'PENDIENTE' || q.status === 'CONFIRMADA' || q.status === 'INACTIVA')
    );
  }

  get pastAppointments(): QuoteResponse[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(q => 
      q.quoteDate < today || 
      q.status === 'COMPLETADA' || 
      q.status === 'CANCELADA'
    );
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'P':
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADA': return 'Confirmada';
      case 'COMPLETADA': return 'Completada';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  }



  cancelAppointment(quote: QuoteResponse): void {
    const msg = '¿Estás seguro de que quieres cancelar esta cita? Si necesitas ayuda, escríbenos por WhatsApp.';
    if (window.confirm(msg)) {
      this.quoteService.cancel(quote.id).subscribe({
        next: () => this.loadAppointments(),
        error: (err) => alert('Error al cancelar la cita.')
      });
    } else {
      this.openWhatsApp('Hola, necesito cancelar mi cita en el spa.');
    }
  }



  openWhatsApp(message: string): void {
    const phone = '51912470219';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
