import { Routes } from '@angular/router';

export const ROOMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./room-list.component').then(m => m.RoomListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./room-form.component').then(m => m.RoomFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./room-form.component').then(m => m.RoomFormComponent)
  }
];
