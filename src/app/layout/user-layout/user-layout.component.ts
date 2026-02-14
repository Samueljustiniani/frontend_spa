import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  menuOpen = false;
  userDropdownOpen = false;
  sidebarOpen = false;

  // Reloj
  currentTime = '';
  currentDate = '';
  private clockInterval: any;

  menuItems = [
    { label: 'Inicio', icon: 'home', route: '/' },
    { label: 'Servicios', icon: 'spa', route: '/cliente/servicios' },
    { label: 'Productos', icon: 'inventory_2', route: '/cliente/productos' },
    { label: 'Mis Citas', icon: 'event', route: '/cliente/mis-citas', authRequired: true },
    { label: 'Contacto', icon: 'mail', route: '/cliente/contacto' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Iniciar reloj
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    if (!this.currentUser && this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 992) {
      this.sidebarOpen = false;
    }
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  closeUserDropdown(): void {
    this.userDropdownOpen = false;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getDisplayName(): string {
    if (this.currentUser?.name && this.currentUser?.lastname) {
      return `${this.currentUser.name} ${this.currentUser.lastname}`;
    }
    if (this.currentUser?.name) {
      return this.currentUser.name;
    }
    return 'Usuario';
  }

  getUserInitials(): string {
    if (this.currentUser?.name && this.currentUser?.lastname) {
      return `${this.currentUser.name.charAt(0)}${this.currentUser.lastname.charAt(0)}`;
    }
    if (this.currentUser?.name) {
      return this.currentUser.name.charAt(0);
    }
    return 'U';
  }

  hasPhoto(): boolean {
    return !!(this.currentUser?.photoUrl && this.currentUser.photoUrl.length > 0);
  }

  isAdmin(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  private updateClock(): void {
    const now = new Date();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    this.currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;
    this.currentDate = `${dias[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]} ${now.getFullYear()}`;
  }
}
