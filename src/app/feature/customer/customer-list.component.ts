import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { UserDTO } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  users: UserDTO[] = [];
  loading = false;
  searchTerm = '';
  showInactive = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    const request$ = this.showInactive 
      ? this.userService.listAll() 
      : this.userService.list();
    
    request$.subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de desactivar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }

  reactivateUser(id: number): void {
    this.userService.reactivate(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error reactivating user:', err)
    });
  }

  toggleShowInactive(): void {
    this.showInactive = !this.showInactive;
    this.loadUsers();
  }

  getRoleClass(role: string): string {
    // Manejar roles que vienen como 'ROLE_ADMIN' o 'ROLE_USER'
    if (!role) return 'bg-secondary';
    const r = role.toUpperCase();
    if (r.includes('ADMIN')) return 'badge bg-danger';
    if (r.includes('USER')) return 'badge bg-primary';
    return 'badge bg-secondary';
  }

  // Etiqueta amigable para mostrar en la UI
  getRoleLabel(role: string): string {
    if (!role) return 'Usuario';
    const r = role.toUpperCase();
    if (r.includes('ADMIN')) return 'Admin';
    if (r.includes('USER')) return 'Usuarios';
    // Si ya viene en formato legible, devolverlo capitalizado
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  get filteredUsers(): UserDTO[] {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u => 
      u.name?.toLowerCase().includes(term) || 
      u.email?.toLowerCase().includes(term) ||
      u.lastname?.toLowerCase().includes(term)
    );
  }
}
