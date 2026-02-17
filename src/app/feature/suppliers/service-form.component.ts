import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpaServiceService } from '../../core/services/spa-service.service';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="service-form-container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-7">
          <!-- Header -->
          <div class="form-header mb-4">
            <div class="d-flex align-items-center">
              <a routerLink="/admin/services" class="btn btn-icon me-3">
                <i class="material-icons">arrow_back</i>
              </a>
              <div>
                <h2 class="mb-1">{{ isEdit ? 'Editar Servicio' : 'Nuevo Servicio' }}</h2>
                <p class="text-muted mb-0">{{ isEdit ? 'Modifica los datos del servicio' : 'Completa los datos para crear un nuevo servicio' }}</p>
              </div>
            </div>
          </div>

          <!-- Card Principal -->
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                
                <!-- Sección: Información Básica -->
                <div class="form-section mb-4">
                  <h6 class="section-title">
                    <i class="material-icons me-2">info</i>
                    Información Básica
                  </h6>
                  
                  <div class="mb-3">
                    <label class="form-label fw-medium">Nombre del Servicio *</label>
                    <input type="text" class="form-control form-control-lg" formControlName="name"
                           placeholder="Ej: Masaje Relajante">
                    <div class="invalid-feedback" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">
                      El nombre es requerido
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label fw-medium">Descripción</label>
                    <textarea class="form-control" formControlName="description" rows="3"
                              placeholder="Describe brevemente el servicio..."></textarea>
                  </div>
                </div>

                <!-- Sección: Detalles del Servicio -->
                <div class="form-section mb-4">
                  <h6 class="section-title">
                    <i class="material-icons me-2">tune</i>
                    Detalles del Servicio
                  </h6>
                  
                  <div class="row g-3">
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Duración *</label>
                      <div class="input-group">
                        <input type="number" class="form-control" formControlName="durationMinutes" min="1">
                        <span class="input-group-text">min</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Precio *</label>
                      <div class="input-group">
                        <span class="input-group-text">S/.</span>
                        <input type="number" class="form-control" formControlName="price" step="0.01" min="0">
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Género *</label>
                      <select class="form-select" formControlName="gender">
                        <option value="U">Unisex</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </select>
                    </div>
                  </div>
                  
                  <!-- Estado solo en modo edición -->
                  <div class="row g-3 mt-2" *ngIf="isEdit">
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Estado</label>
                      <select class="form-select" formControlName="status">
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Sección: Imagen -->
                <div class="form-section mb-4">
                  <h6 class="section-title">
                    <i class="material-icons me-2">image</i>
                    Imagen del Servicio
                  </h6>
                  
                  <div class="image-upload-area">
                    <!-- Preview de imagen -->
                    <div *ngIf="imagePreview" class="image-preview-container mb-3">
                      <div class="image-preview">
                        <img [src]="imagePreview" alt="Preview">
                        <div class="image-overlay">
                          <button type="button" class="btn btn-light btn-sm me-2" (click)="viewImage()">
                            <i class="material-icons">visibility</i>
                          </button>
                          <button type="button" class="btn btn-danger btn-sm" (click)="removeImage()">
                            <i class="material-icons">delete</i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Dropzone -->
                    <div class="dropzone" *ngIf="!imagePreview" (click)="fileInput.click()">
                      <input type="file" #fileInput class="d-none" accept="image/*"
                             (change)="onFileSelected($event)">
                      <i class="material-icons upload-icon">cloud_upload</i>
                      <p class="mb-1">Haz clic para seleccionar una imagen</p>
                      <small class="text-muted">JPG, PNG o GIF (máx. 5MB)</small>
                    </div>
                    
                    <!-- Cambiar imagen si ya hay una -->
                    <div *ngIf="imagePreview" class="text-center">
                      <button type="button" class="btn btn-outline-primary btn-sm" (click)="fileInput.click()">
                        <i class="material-icons me-1">refresh</i>
                        Cambiar imagen
                      </button>
                      <input type="file" #fileInput class="d-none" accept="image/*"
                             (change)="onFileSelected($event)">
                    </div>
                    
                    <!-- Progress bar -->
                    <div *ngIf="uploading" class="mt-3">
                      <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" 
                             style="width: 100%">Subiendo imagen...</div>
                      </div>
                    </div>
                    
                    <input type="hidden" formControlName="imageUrl">
                  </div>
                </div>

                <!-- Botones de acción -->
                <div class="form-actions d-flex gap-3 pt-3 border-top">
                  <button type="submit" class="btn btn-primary btn-lg flex-grow-1" 
                          [disabled]="submitting || uploading || form.invalid">
                    <span *ngIf="submitting || uploading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="material-icons me-2" *ngIf="!submitting && !uploading">{{ isEdit ? 'save' : 'add' }}</i>
                    {{ isEdit ? 'Guardar Cambios' : 'Crear Servicio' }}
                  </button>
                  <a routerLink="/admin/services" class="btn btn-outline-secondary btn-lg">
                    Cancelar
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para ver imagen -->
    <div class="modal fade" [class.show]="showImageModal" [style.display]="showImageModal ? 'block' : 'none'"
         tabindex="-1" (click)="closeImageModal()">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header border-0">
            <h5 class="modal-title">Vista previa</h5>
            <button type="button" class="btn-close" (click)="closeImageModal()"></button>
          </div>
          <div class="modal-body text-center p-0">
            <img [src]="imagePreview" alt="Imagen del servicio" class="img-fluid">
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="showImageModal" *ngIf="showImageModal"></div>
  `,
  styles: [`
    .service-form-container {
      padding: 1.5rem;
    }
    .form-header h2 {
      color: #2d3748;
      font-weight: 600;
    }
    .btn-icon {
      width: 40px;
      height: 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: #f1f5f9;
      color: #475569;
      transition: all 0.2s;
    }
    .btn-icon:hover {
      background: #e2e8f0;
      color: #1e293b;
    }
    .card {
      border-radius: 16px;
    }
    .form-section {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }
    .form-section:last-of-type {
      border-bottom: none;
    }
    .section-title {
      display: flex;
      align-items: center;
      color: #6B9080;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .section-title .material-icons {
      font-size: 20px;
    }
    .form-control, .form-select {
      border-radius: 10px;
      border: 1.5px solid #e2e8f0;
      padding: 0.75rem 1rem;
      transition: all 0.2s;
    }
    .form-control:focus, .form-select:focus {
      border-color: #6B9080;
      box-shadow: 0 0 0 3px rgba(107, 144, 128, 0.15);
    }
    .form-control-lg {
      font-size: 1.1rem;
    }
    .input-group-text {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
    }
    .input-group .form-control {
      border-radius: 0 10px 10px 0 !important;
    }
    .input-group .input-group-text:first-child {
      border-radius: 10px 0 0 10px;
    }
    
    /* Image Upload Styles */
    .image-upload-area {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .dropzone {
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 2.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .dropzone:hover {
      border-color: #6B9080;
      background: rgba(107, 144, 128, 0.05);
    }
    .upload-icon {
      font-size: 48px;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }
    .dropzone:hover .upload-icon {
      color: #6B9080;
    }
    .image-preview-container {
      display: flex;
      justify-content: center;
    }
    .image-preview {
      position: relative;
      display: inline-block;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .image-preview img {
      max-width: 300px;
      max-height: 200px;
      object-fit: cover;
      display: block;
    }
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .image-preview:hover .image-overlay {
      opacity: 1;
    }
    .image-overlay .btn {
      padding: 0.5rem;
      border-radius: 50%;
    }
    .image-overlay .material-icons {
      font-size: 20px;
    }
    
    /* Buttons */
    .btn-primary {
      background: linear-gradient(135deg, #6B9080 0%, #5a7d6f 100%);
      border: none;
      border-radius: 12px;
      font-weight: 500;
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #5a7d6f 0%, #4a6d5f 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(107, 144, 128, 0.35);
    }
    .btn-outline-secondary {
      border-radius: 12px;
      border-width: 1.5px;
    }
    .btn-lg {
      padding: 0.875rem 1.5rem;
    }
    .btn .material-icons {
      font-size: 20px;
      vertical-align: middle;
    }
    
    /* Modal */
    .modal.show {
      background: rgba(0,0,0,0.5);
    }
    .modal-content {
      border-radius: 16px;
      border: none;
    }
    .modal-body img {
      border-radius: 0 0 16px 16px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .service-form-container {
        padding: 1rem;
      }
      .form-header {
        flex-direction: column;
        text-align: center;
      }
      .form-header .d-flex {
        flex-direction: column;
        align-items: center !important;
      }
      .form-header .btn-icon {
        margin-bottom: 1rem;
        margin-right: 0 !important;
      }
      .form-header h2 {
        font-size: 1.5rem;
      }
      .card-body {
        padding: 1.25rem !important;
      }
      .form-section {
        padding-bottom: 1rem;
      }
      .section-title {
        font-size: 0.9rem;
      }
      .row.g-3 > [class*="col-"] {
        margin-bottom: 0.5rem;
      }
      .form-actions {
        flex-direction: column;
      }
      .form-actions .btn {
        width: 100%;
      }
      .form-actions a.btn {
        order: 2;
      }
      .image-preview img {
        max-width: 100%;
        max-height: 180px;
      }
      .dropzone {
        padding: 1.5rem;
      }
      .upload-icon {
        font-size: 36px;
      }
      .btn-lg {
        padding: 0.75rem 1rem;
        font-size: 0.95rem;
      }
    }
    
    @media (max-width: 480px) {
      .service-form-container {
        padding: 0.5rem;
      }
      .card-body {
        padding: 1rem !important;
      }
      .form-control-lg {
        font-size: 1rem;
      }
      .input-group-text {
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class ServiceFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  serviceId?: number;
  submitting = false;
  uploading = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  showImageModal = false;

  constructor(
    private fb: FormBuilder,
    private spaService: SpaServiceService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      durationMinutes: [60, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      gender: ['U', Validators.required],
      imageUrl: [''],
      status: ['A', Validators.required]
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.serviceId = +id;
      this.spaService.getById(this.serviceId).subscribe(s => {
        this.form.patchValue(s);
        if (s.imageUrl) {
          this.imagePreview = s.imageUrl;
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.form.patchValue({ imageUrl: '' });
  }

  viewImage(): void {
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;

    if (this.selectedFile) {
      this.uploading = true;
      this.imageService.upload(this.selectedFile).subscribe({
        next: (response) => {
          this.form.patchValue({ imageUrl: response.secure_url });
          this.uploading = false;
          this.saveService();
        },
        error: (err) => {
          console.error('Error uploading image:', err);
          this.uploading = false;
          this.submitting = false;
          alert('Error al subir la imagen. Por favor, intente de nuevo.');
        }
      });
    } else {
      this.saveService();
    }
  }

  private saveService(): void {
    const request$ = this.isEdit
      ? this.spaService.update(this.serviceId!, this.form.value)
      : this.spaService.create(this.form.value);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/services']),
      error: () => this.submitting = false
    });
  }
}
