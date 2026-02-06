import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

export const CLIENTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent)
  },
  {
    path: 'servicios',
    loadComponent: () => import('./client-services.component').then(m => m.ClientServicesComponent)
  },
  {
    path: 'productos',
    loadComponent: () => import('./client-products.component').then(m => m.ClientProductsComponent)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'reservar',
    canActivate: [AuthGuard],
    loadComponent: () => import('./booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'mis-citas',
    canActivate: [AuthGuard],
    loadComponent: () => import('./my-appointments.component').then(m => m.MyAppointmentsComponent)
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard],
    loadComponent: () => import('./user-profile.component').then(m => m.UserProfileComponent)
  }
];
