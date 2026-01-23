import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'signin',
    loadComponent: () => import('./login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'callback',
    loadComponent: () => import('./oauth-callback.component').then(m => m.OAuthCallbackComponent)
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  }
];
