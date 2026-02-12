import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { QuoteService } from '../../core/services/quote.service';
import { RoomService } from '../../core/services/room.service';
import { SpaServiceService } from '../../core/services/spa-service.service';
import { UserService } from '../../core/services/user.service';
import { Room } from '../../core/interfaces/room.interface';
import { ServiceEntity } from '../../core/interfaces/service.interface';
import { UserDTO } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.scss']
})
export class QuoteFormComponent implements OnInit {
  form!: FormGroup;
  rooms: Room[] = [];
  services: ServiceEntity[] = [];
  users: UserDTO[] = [];
  loading = false;
  submitting = false;
  availabilityMessage = '';
  isEdit = false;
  quoteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private roomService: RoomService,
    private spaService: SpaServiceService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    
    // Check if editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.quoteId = +id;
      this.loadQuote(this.quoteId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      userId: [null, Validators.required],
      serviceIds: [[], Validators.required],
      roomId: [null, Validators.required],
      quoteDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  loadData(): void {
    this.loading = true;
    this.roomService.list().subscribe(r => this.rooms = r.filter(room => room.status === 'A'));
    this.spaService.list().subscribe(s => this.services = s);
    this.userService.list().subscribe({
      next: (u) => {
        this.users = u;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadQuote(id: number): void {
    this.quoteService.getById(id).subscribe({
      next: (quote) => {
        this.form.patchValue({
          userId: quote.userId,
          serviceIds: quote.serviceIds || [],
          roomId: quote.roomId,
          quoteDate: quote.quoteDate,
          startTime: quote.startTime?.substring(0, 5),
          endTime: quote.endTime?.substring(0, 5)
        });
      },
      error: (err) => {
        console.error('Error loading quote:', err);
        this.router.navigate(['/admin/quotes']);
      }
    });
  }

  checkAvailability(): void {
    const { roomId, quoteDate, startTime, endTime } = this.form.value;
    if (roomId && quoteDate && startTime && endTime) {
      this.quoteService.checkAvailability(roomId, quoteDate, startTime, endTime).subscribe({
        next: (available) => {
          this.availabilityMessage = available 
            ? '✓ Horario disponible' 
            : '✗ Horario no disponible';
        },
        error: () => this.availabilityMessage = ''
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    
    const quoteData = {
      userId: this.form.value.userId,
      serviceIds: this.form.value.serviceIds || [],
      roomId: this.form.value.roomId,
      quoteDate: this.form.value.quoteDate,
      startTime: this.form.value.startTime,
      endTime: this.form.value.endTime
    };
    
    const operation = this.isEdit && this.quoteId
      ? this.quoteService.update(this.quoteId, quoteData)
      : this.quoteService.create(quoteData);
      
    operation.subscribe({
      next: () => this.router.navigate(['/admin/quotes']),
      error: (err) => {
        console.error('Error saving quote:', err);
        alert(err.error?.message || 'Error al guardar la cita');
        this.submitting = false;
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
