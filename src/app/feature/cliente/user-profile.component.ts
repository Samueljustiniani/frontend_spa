import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/interfaces';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Page Header -->
    <section class="page-header py-5 bg-light">
      <div class="container">
        <h1 class="fw-bold">Mi Perfil</h1>
        <p class="text-muted lead mb-0">Gestiona tu información personal</p>
      </div>
    </section>

    <!-- Profile Content -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <!-- Profile Sidebar -->
          <div class="col-lg-4 mb-4">
            <div class="card border-0 shadow-sm text-center">
              <div class="card-body py-5">
                <div class="avatar-large mb-3" *ngIf="!hasPhoto()">
                  <span>{{ getInitials() }}</span>
                </div>
                <img *ngIf="hasPhoto()" [src]="user?.photoUrl" class="profile-avatar-img mb-3" alt="Foto de perfil">
                <h4>{{ user?.name }} {{ user?.lastname }}</h4>
                <p class="text-muted mb-0">{{ user?.email }}</p>
                <span class="badge bg-primary mt-2">{{ (user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN') ? 'Administrador' : 'Cliente' }}</span>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">Información Personal</h5>
              </div>
              <div class="card-body p-4">
                <form (ngSubmit)="onSubmit()">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Nombre</label>
                      <input type="text" class="form-control" [(ngModel)]="formData.name" name="name" required>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Apellido</label>
                      <input type="text" class="form-control" [(ngModel)]="formData.lastname" name="lastname">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" [(ngModel)]="formData.email" name="email" readonly disabled>
                      <small class="text-muted">El email no se puede modificar</small>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Teléfono</label>
                      <input type="tel" class="form-control" [(ngModel)]="formData.phone" name="phone">
                    </div>
                  </div>

                  <hr class="my-4">

                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="text-muted">Miembro desde: {{ user?.createdAt | date:'MMM yyyy' }}</span>
                    </div>
                    <button type="submit" class="btn btn-gradient" [disabled]="saving">
                      {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                    </button>
                  </div>
                </form>

                <!-- Success/Error Messages -->
                <div *ngIf="successMsg" class="alert alert-success mt-3" role="alert">
                  {{ successMsg }}
                </div>
                <div *ngIf="errorMsg" class="alert alert-danger mt-3" role="alert">
                  {{ errorMsg }}
                </div>
              </div>
            </div>

            <!-- Change Password Card -->
            <div class="card border-0 shadow-sm mt-4">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">Cambiar Contraseña</h5>
              </div>
              <div class="card-body p-4">
                <form (ngSubmit)="onChangePassword()">
                  <div class="row g-3">
                    <div class="col-md-4">
                      <label class="form-label">Contraseña Actual</label>
                      <input type="password" class="form-control" [(ngModel)]="passwordData.current" name="currentPassword">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Nueva Contraseña</label>
                      <input type="password" class="form-control" [(ngModel)]="passwordData.new" name="newPassword">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Confirmar Contraseña</label>
                      <input type="password" class="form-control" [(ngModel)]="passwordData.confirm" name="confirmPassword">
                    </div>
                  </div>
                  <div class="mt-3">
                    <button type="submit" class="btn btn-outline-primary">
                      Actualizar Contraseña
                    </button>
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
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.1) 0%, rgba(164, 195, 178, 0.1) 100%);
    }
    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 36px;
      margin: 0 auto;
    }
    .profile-avatar-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #6B9080;
    }
    .btn-gradient {
      background: linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%);
      border: none;
      color: white;
      border-radius: 25px;
      padding: 10px 30px;
    }
    .btn-gradient:hover {
      color: white;
      box-shadow: 0 5px 15px rgba(107, 144, 128, 0.4);
    }
  `]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  formData = {
    name: '',
    lastname: '',
    email: '',
    phone: ''
  };
  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };
  saving = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.formData = {
          name: user.name || '',
          lastname: user.lastname || '',
          email: user.email || '',
          phone: user.phone || ''
        };
      }
    });
  }

  getInitials(): string {
    if (this.user?.name && this.user?.lastname) {
      return (this.user.name.charAt(0) + this.user.lastname.charAt(0)).toUpperCase();
    }
    if (this.user?.name) {
      return this.user.name.slice(0, 2).toUpperCase();
    }
    return 'US';
  }

  hasPhoto(): boolean {
    return !!(this.user?.photoUrl && this.user.photoUrl.length > 0);
  }

  onSubmit(): void {
    if (!this.user?.id) return;
    
    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.userService.update(this.user.id, this.formData as any).subscribe({
      next: (updatedUser) => {
        this.saving = false;
        this.successMsg = 'Perfil actualizado correctamente';
        // Update local user
        this.authService.setCurrentUser({ ...this.user!, ...updatedUser } as User);
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = 'Error al actualizar el perfil';
        console.error(err);
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordData.new !== this.passwordData.confirm) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }
    // TODO: Implement password change API call
    alert('Funcionalidad de cambio de contraseña próximamente');
  }
}
