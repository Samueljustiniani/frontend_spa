import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Auth routes (sin guard, sin layout)
  {
    path: 'auth',
    loadChildren: () => import('./feature/login/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Rutas protegidas con Admin Layout
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      // Dashboard - ruta principal
      {
        path: 'dashboard',
        loadComponent: () => import('./feature/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // Products
      {
        path: 'products',
        loadChildren: () => import('./feature/products/products.routes').then(m => m.PRODUCTS_ROUTES)
      },

      // Sales (Ventas)
      {
        path: 'sales',
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./feature/sale/sales.routes').then(m => m.SALES_ROUTES)
      },

      // Customers (Usuarios)
      {
        path: 'customers',
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./feature/customer/customers.routes').then(m => m.CUSTOMERS_ROUTES)
      },

      // Quotes (Citas/Reservas)
      {
        path: 'quotes',
        loadChildren: () => import('./feature/shopping/quotes.routes').then(m => m.QUOTES_ROUTES)
      },

      // Rooms (Salas)
      {
        path: 'rooms',
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./feature/lots/rooms.routes').then(m => m.ROOMS_ROUTES)
      },

      // Services (Servicios del SPA)
      {
        path: 'services',
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./feature/suppliers/services.routes').then(m => m.SERVICES_ROUTES)
      },

      // Redirigir raíz al dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Redirigir rutas no encontradas
  { path: '**', redirectTo: '/dashboard' }
];
