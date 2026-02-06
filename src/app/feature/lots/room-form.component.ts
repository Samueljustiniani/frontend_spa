import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="row">
      <div class="col-md-6 mx-auto">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="material-icons me-2" style="vertical-align: middle;">meeting_room</i>
              {{ isEdit ? 'Editar Sala' : 'Nueva Sala' }}
            </h5>
          </div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-control" formControlName="name">
              </div>
              <div class="mb-3">
                <label class="form-label">Tipo</label>
                <select class="form-select" formControlName="type">
                  <option value="Masajes">Masajes</option>
                  <option value="Facial">Facial</option>
                  <option value="Spa">Spa</option>
                  <option value="Relajación">Relajación</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="form-label">Estado</label>
                <select class="form-select" formControlName="status">
                  <option value="A">Disponible</option>
                  <option value="I">No disponible</option>
                </select>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" [disabled]="submitting">
                  {{ isEdit ? 'Actualizar' : 'Crear' }}
                </button>
                <a routerLink="/rooms" class="btn btn-outline-secondary">Cancelar</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RoomFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  roomId?: number;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['Masajes'],
      status: ['A']
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.roomId = +id;
      this.roomService.getById(this.roomId).subscribe(r => this.form.patchValue(r));
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;

    const request$ = this.isEdit
      ? this.roomService.update(this.roomId!, this.form.value)
      : this.roomService.create(this.form.value);

    request$.subscribe({
      next: () => this.router.navigate(['/rooms']),
      error: () => this.submitting = false
    });
  }
}
