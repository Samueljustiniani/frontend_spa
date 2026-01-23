import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sale-list.component').then(m => m.SaleListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./sale-form.component').then(m => m.SaleFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./sale-detail.component').then(m => m.SaleDetailComponent)
  }
];
