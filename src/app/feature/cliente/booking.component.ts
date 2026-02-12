import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { QuoteService } from '../../core/services/quote.service';
import { RoomService } from '../../core/services/room.service';
import { SpaServiceService } from '../../core/services/spa-service.service';
import { AuthService } from '../../core/services/auth.service';
import { Room } from '../../core/interfaces/room.interface';
import { ServiceEntity } from '../../core/interfaces/service.interface';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <!-- Page Header -->
    <section class="page-header py-5">
      <div class="container text-center">
        <h1 class="fw-bold text-white">{{ isEdit ? 'Modificar Cita' : 'Reservar Cita' }}</h1>
        <p class="text-white-50 lead mb-0">{{ isEdit ? 'Actualiza los detalles de tu cita' : 'Agenda tu momento de bienestar' }}</p>
      </div>
    </section>

    <!-- Booking Form -->
    <section class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card border-0 shadow-lg booking-card">
              <div class="card-body p-4 p-md-5">
                
                <!-- Loading -->
                <div *ngIf="loading" class="text-center py-5">
                  <div class="spinner-border" role="status" style="color: #6B9080;"></div>
                  <p class="mt-3 text-muted">Cargando opciones...</p>
                </div>

                <!-- Form -->
                <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="onSubmit()">
                  
                  <!-- Step 1: Select Services (Multiple) -->
                  <div class="form-section mb-4">
                    <h5 class="section-title">
                      <span class="step-number">1</span>
                      Selecciona los Servicios
                      <small class="text-muted ms-2">(puedes elegir varios)</small>
                    </h5>
                    <div class="row g-3">
                      <div class="col-12" *ngFor="let service of services">
                        <div class="service-option" 
                             [class.selected]="isServiceSelected(service.id)"
                             (click)="toggleService(service)">
                          <div class="service-check">
                            <i class="material-icons">{{ isServiceSelected(service.id) ? 'check_box' : 'check_box_outline_blank' }}</i>
                          </div>
                          <div class="service-info">
                            <i class="material-icons service-icon">spa</i>
                            <div>
                              <h6 class="mb-0">{{ service.name }}</h6>
                              <small class="text-muted">{{ service.durationMinutes }} min</small>
                            </div>
                          </div>
                          <span class="service-price">S/. {{ service.price }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-danger small mt-2" *ngIf="selectedServices.length === 0 && formSubmitted">
                      Selecciona al menos un servicio
                    </div>
                    <div class="selected-summary mt-3" *ngIf="selectedServices.length > 0">
                      <span class="badge bg-success me-2">{{ selectedServices.length }} servicio(s)</span>
                      <span class="text-muted">Duración total: {{ totalDuration }} min</span>
                    </div>
                  </div>

                  <!-- Step 2: Select Room -->
                  <div class="form-section mb-4">
                    <h5 class="section-title">
                      <span class="step-number">2</span>
                      Selecciona la Sala
                    </h5>
                    <div class="row g-3">
                      <div class="col-md-6" *ngFor="let room of rooms">
                        <div class="room-option" 
                             [class.selected]="form.get('roomId')?.value === room.id"
                             (click)="selectRoom(room)">
                          <i class="material-icons">meeting_room</i>
                          <div>
                            <h6 class="mb-0">{{ room.name }}</h6>
                            <small class="text-muted">{{ room.type }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-danger small mt-2" *ngIf="isInvalid('roomId')">
                      Selecciona una sala
                    </div>
                  </div>

                  <!-- Step 3: Select Date & Time -->
                  <div class="form-section mb-4">
                    <h5 class="section-title">
                      <span class="step-number">3</span>
                      Fecha y Hora
                    </h5>
                    <div class="row g-3">
                      <div class="col-md-4">
                        <label class="form-label">Fecha</label>
                        <input type="date" class="form-control form-control-lg" 
                               formControlName="quoteDate"
                               [min]="minDate"
                               (change)="checkAvailability()">
                        <div class="text-danger small mt-1" *ngIf="isInvalid('quoteDate')">
                          Selecciona una fecha
                        </div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Hora inicio</label>
                        <select class="form-select form-select-lg" formControlName="startTime"
                                (change)="onStartTimeChange()">
                          <option value="">Seleccionar</option>
                          <option *ngFor="let time of timeSlots" [value]="time">{{ time }}</option>
                        </select>
                        <div class="text-danger small mt-1" *ngIf="isInvalid('startTime')">
                          Selecciona hora de inicio
                        </div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Hora fin</label>
                        <input type="text" class="form-control form-control-lg" 
                               formControlName="endTime" readonly
                               placeholder="Automático">
                      </div>
                    </div>
                    
                    <!-- Availability Message -->
                    <div class="mt-3" *ngIf="availabilityMessage">
                      <div class="alert" [class.alert-success]="isAvailable" [class.alert-danger]="!isAvailable">
                        <i class="material-icons me-2" style="vertical-align: middle;">
                          {{ isAvailable ? 'check_circle' : 'cancel' }}
                        </i>
                        {{ availabilityMessage }}
                      </div>
                    </div>
                  </div>

                  <!-- Summary -->
                  <div class="booking-summary mb-4" *ngIf="selectedServices.length > 0">
                    <h5 class="mb-3">Resumen de tu Reserva</h5>
                    <div class="summary-services">
                      <span class="summary-label">Servicios:</span>
                      <div class="services-list">
                        <div class="service-item" *ngFor="let service of selectedServices">
                          <span>{{ service.name }}</span>
                          <span>S/. {{ service.price }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="summary-item" *ngIf="selectedRoom">
                      <span>Sala:</span>
                      <strong>{{ selectedRoom.name }}</strong>
                    </div>
                    <div class="summary-item">
                      <span>Duración total:</span>
                      <strong>{{ totalDuration }} minutos</strong>
                    </div>
                    <div class="summary-item" *ngIf="form.get('quoteDate')?.value">
                      <span>Fecha:</span>
                      <strong>{{ form.get('quoteDate')?.value | date:'dd/MM/yyyy' }}</strong>
                    </div>
                    <div class="summary-item" *ngIf="form.get('startTime')?.value">
                      <span>Horario:</span>
                      <strong>{{ form.get('startTime')?.value }} - {{ form.get('endTime')?.value }}</strong>
                    </div>
                    <hr>
                    <div class="summary-item total">
                      <span>Total a pagar:</span>
                      <strong>S/. {{ totalPrice | number:'1.2-2' }}</strong>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-gradient btn-lg" 
                            [disabled]="submitting || !isAvailable || selectedServices.length === 0">
                      <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                      {{ submitting ? (isEdit ? 'Guardando...' : 'Reservando...') : (isEdit ? 'Guardar Cambios' : 'Confirmar Reserva') }}
                    </button>
                    <a [routerLink]="isEdit ? '/cliente/mis-citas' : '/cliente/servicios'" class="btn btn-outline-secondary">
                      Cancelar
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, #6B9080 0%, #2d5a47 100%);
    }
    
    .booking-card {
      border-radius: 20px;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      color: #2d5a47;
    }
    
    .step-number {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6B9080, #A4C3B2);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .service-option {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .service-option:hover {
      border-color: #A4C3B2;
      background: rgba(164, 195, 178, 0.1);
    }
    
    .service-option.selected {
      border-color: #6B9080;
      background: rgba(107, 144, 128, 0.15);
    }
    
    .service-check {
      margin-right: 15px;
      
      .material-icons {
        font-size: 28px;
        color: #6B9080;
      }
    }
    
    .service-info {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }
    
    .service-icon {
      font-size: 28px;
      color: #6B9080;
    }
    
    .service-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #6B9080;
    }
    
    .selected-summary {
      padding: 10px 15px;
      background: rgba(107, 144, 128, 0.1);
      border-radius: 8px;
    }
    
    .room-option {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 20px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .room-option:hover {
      border-color: #A4C3B2;
      background: rgba(164, 195, 178, 0.1);
    }
    
    .room-option.selected {
      border-color: #6B9080;
      background: rgba(107, 144, 128, 0.1);
    }
    
    .room-option .material-icons {
      font-size: 28px;
      color: #6B9080;
    }
    
    .booking-summary {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
    }
    
    .summary-services {
      margin-bottom: 15px;
      
      .summary-label {
        color: #666;
        display: block;
        margin-bottom: 8px;
      }
      
      .services-list {
        background: white;
        border-radius: 8px;
        padding: 10px;
      }
      
      .service-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      
      span {
        color: #666;
      }
      
      &.total {
        font-size: 1.3rem;
        margin-bottom: 0;
        margin-top: 15px;
        
        strong {
          color: #6B9080;
        }
      }
    }
    
    .btn-gradient {
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      border: none;
      color: white;
      border-radius: 50px;
      padding: 15px 30px;
      font-weight: 600;
    }
    
    .btn-gradient:hover:not(:disabled) {
      color: white;
      box-shadow: 0 5px 20px rgba(107, 144, 128, 0.4);
      transform: translateY(-2px);
    }
    
    .btn-gradient:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class BookingComponent implements OnInit {
  form!: FormGroup;
  rooms: Room[] = [];
  services: ServiceEntity[] = [];
  selectedServices: ServiceEntity[] = [];
  loading = true;
  submitting = false;
  formSubmitted = false;
  availabilityMessage = '';
  isAvailable = false;
  minDate: string;
  selectedRoom: Room | null = null;
  
  timeSlots: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private roomService: RoomService,
    private spaService: SpaServiceService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  isEdit = false;
  quoteId: number | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    
    // Check for edit mode or pre-selected service
    this.route.queryParams.subscribe(params => {
      if (params['editId']) {
        this.isEdit = true;
        this.quoteId = +params['editId'];
        this.loadQuote();
      } else if (params['serviceId']) {
        const preSelectedId = +params['serviceId'];
        // Will be handled after services load
        this.form.patchValue({ preSelectedServiceId: preSelectedId });
      }
    });
  }

  loadQuote(): void {
    if (!this.quoteId) return;
    
    this.loading = true;
    this.quoteService.getById(this.quoteId).subscribe({
      next: (quote: any) => {
        this.form.patchValue({
          roomId: quote.roomId,
          quoteDate: quote.quoteDate,
          startTime: quote.startTime,
          endTime: quote.endTime
        });
        
        // Set selected room
        this.selectedRoom = this.rooms.find(r => r.id === quote.roomId) || null;
        
        // Set selected services - wait for services to load
        const setServices = () => {
          if (this.services.length > 0) {
            if (quote.serviceIds) {
              this.selectedServices = this.services.filter(s => quote.serviceIds.includes(s.id));
            } else if (quote.serviceId) {
              const service = this.services.find(s => s.id === quote.serviceId);
              if (service) this.selectedServices = [service];
            }
            this.cdr.detectChanges();
          } else {
            setTimeout(setServices, 100);
          }
        };
        setServices();
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      roomId: [null, Validators.required],
      quoteDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      preSelectedServiceId: [null]
    });
  }

  loadData(): void {
    this.loading = true;
    
    this.roomService.list().subscribe({
      next: (rooms) => {
        this.rooms = rooms.filter(r => r.status === 'A');
        this.cdr.detectChanges();
      }
    });
    
    this.spaService.listActivos().subscribe({
      next: (services) => {
        this.services = services;
        this.loading = false;
        
        // Handle pre-selected service
        const preSelectedId = this.form.get('preSelectedServiceId')?.value;
        if (preSelectedId) {
          const service = this.services.find(s => s.id === preSelectedId);
          if (service) {
            this.selectedServices = [service];
          }
        }
        
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Check if a service is selected
  isServiceSelected(serviceId: number): boolean {
    return this.selectedServices.some(s => s.id === serviceId);
  }

  // Toggle service selection
  toggleService(service: ServiceEntity): void {
    const index = this.selectedServices.findIndex(s => s.id === service.id);
    if (index >= 0) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
    this.onStartTimeChange(); // Recalculate end time
    this.cdr.detectChanges();
  }

  // Get total duration of all selected services
  get totalDuration(): number {
    return this.selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  }

  // Get total price of all selected services
  get totalPrice(): number {
    return this.selectedServices.reduce((sum, s) => sum + s.price, 0);
  }

  selectRoom(room: Room): void {
    this.form.patchValue({ roomId: room.id });
    this.selectedRoom = room;
    this.checkAvailability();
  }

  onStartTimeChange(): void {
    const startTime = this.form.get('startTime')?.value;
    if (startTime && this.totalDuration > 0) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0);
      
      const endDate = new Date(startDate.getTime() + this.totalDuration * 60000);
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      this.form.patchValue({ endTime });
      this.checkAvailability();
    }
  }

  checkAvailability(): void {
    const { roomId, quoteDate, startTime, endTime } = this.form.value;
    
    if (roomId && quoteDate && startTime && endTime && this.selectedServices.length > 0) {
      this.quoteService.checkAvailability(roomId, quoteDate, startTime, endTime).subscribe({
        next: (available) => {
          this.isAvailable = available;
          this.availabilityMessage = available 
            ? '¡Genial! El horario está disponible' 
            : 'Este horario no está disponible, intenta con otro';
          this.cdr.detectChanges();
        },
        error: () => {
          this.availabilityMessage = '';
          this.isAvailable = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.availabilityMessage = '';
      this.isAvailable = false;
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.form.invalid || this.selectedServices.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.isAvailable) {
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/auth/signin'], { 
        queryParams: { returnUrl: '/cliente/reservar' }
      });
      return;
    }

    this.submitting = true;

    const serviceIdsList = this.selectedServices.map(s => s.id);
    const quoteData = {
      userId: userId,
      serviceIds: serviceIdsList,
      roomId: this.form.value.roomId,
      quoteDate: this.form.value.quoteDate,
      startTime: this.form.value.startTime,
      endTime: this.form.value.endTime
    };

    const request$ = this.isEdit && this.quoteId
      ? this.quoteService.update(this.quoteId, quoteData)
      : this.quoteService.create(quoteData);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/cliente/mis-citas'], {
          queryParams: { success: 'true' }
        });
      },
      error: (err) => {
        console.error('Error saving booking:', err);
        alert(err.error?.message || 'Error al guardar la reserva. Intenta nuevamente.');
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
