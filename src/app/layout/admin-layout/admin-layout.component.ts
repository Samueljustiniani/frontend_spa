import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen = true;
  currentUser: User | null = null;
  userDropdownOpen = false;

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard', roles: ['ADMIN', 'USER'] },
    { label: 'Productos', icon: 'inventory_2', route: '/admin/products', roles: ['ADMIN', 'USER'] },
    { label: 'Servicios', icon: 'spa', route: '/admin/services', roles: ['ADMIN'] },
    { label: 'Salas', icon: 'meeting_room', route: '/admin/rooms', roles: ['ADMIN'] },
    { label: 'Citas', icon: 'event', route: '/admin/quotes', roles: ['ADMIN', 'USER'] },
    { label: 'Ventas', icon: 'point_of_sale', route: '/admin/sales', roles: ['ADMIN'] },
    { label: 'Clientes', icon: 'people', route: '/admin/customers', roles: ['ADMIN'] }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del usuario
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Si no hay usuario cargado pero hay sesión, obtener datos del backend
    if (!this.currentUser && this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          console.log('Usuario cargado:', user);
        },
        error: (err) => {
          console.error('Error al cargar usuario:', err);
        }
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  closeUserDropdown(): void {
    this.userDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }

  // Obtener iniciales del nombre y apellido
  getUserInitials(): string {
    if (this.currentUser?.name && this.currentUser?.lastname) {
      return (this.currentUser.name.charAt(0) + this.currentUser.lastname.charAt(0)).toUpperCase();
    }
    if (this.currentUser?.name) {
      const parts = this.currentUser.name.split(' ');
      if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
      }
      return this.currentUser.name.slice(0, 2).toUpperCase();
    }
    if (this.currentUser?.email) {
      return this.currentUser.email.slice(0, 2).toUpperCase();
    }
    return 'US';
  }

  // Obtener nombre completo para mostrar
  getDisplayName(): string {
    if (this.currentUser?.name && this.currentUser?.lastname) {
      return `${this.currentUser.name} ${this.currentUser.lastname}`;
    }
    if (this.currentUser?.name) {
      return this.currentUser.name;
    }
    if (this.currentUser?.email) {
      return this.currentUser.email.split('@')[0];
    }
    return 'Usuario';
  }

  // Verificar si tiene foto de perfil
  hasPhoto(): boolean {
    return !!this.currentUser?.photoUrl;
  }

  // Etiqueta amigable para mostrar rol en el header
  getRoleLabel(): string {
    const role = this.currentUser?.role || '';
    const r = role.toUpperCase();
    if (r.includes('ADMIN')) return 'Admin';
    if (r.includes('USER')) return 'Usuarios';
    return role || 'Usuario';
  }
}
