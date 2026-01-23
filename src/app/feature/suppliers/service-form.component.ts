import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpaServiceService } from '../../core/services/spa-service.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="row">
      <div class="col-md-6 mx-auto">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="feather icon-award me-2"></i>
              {{ isEdit ? 'Editar Servicio' : 'Nuevo Servicio' }}
            </h5>
          </div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-control" formControlName="name">
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" formControlName="description" rows="3"></textarea>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Duración (minutos) *</label>
                  <input type="number" class="form-control" formControlName="durationMinutes" min="1">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Precio *</label>
                  <div class="input-group">
                    <span class="input-group-text">S/.</span>
                    <input type="number" class="form-control" formControlName="price" step="0.01" min="0">
                  </div>
                </div>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" [disabled]="submitting">
                  {{ isEdit ? 'Actualizar' : 'Crear' }}
                </button>
                <a routerLink="/services" class="btn btn-outline-secondary">Cancelar</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ServiceFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  serviceId?: number;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private spaService: SpaServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      durationMinutes: [60, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.serviceId = +id;
      this.spaService.getById(this.serviceId).subscribe(s => this.form.patchValue(s));
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;

    const request$ = this.isEdit
      ? this.spaService.update(this.serviceId!, this.form.value)
      : this.spaService.create(this.form.value);

    request$.subscribe({
      next: () => this.router.navigate(['/services']),
      error: () => this.submitting = false
    });
  }
}
