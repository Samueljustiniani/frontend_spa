import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getUserRole();
      
      // Verificar si es una ruta de admin
      if (state.url.startsWith('/admin')) {
        if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
          return true;
        }
        // Usuario normal no puede acceder a admin
        this.router.navigate(['/']);
        return false;
      }
      
      // Verificar roles si se especifican en la ruta
      const requiredRoles = route.data['roles'] as string[] | undefined;
      if (requiredRoles) {
        if (userRole && requiredRoles.includes(userRole)) {
          return true;
        }
        // Usuario no tiene el rol requerido
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    
    // No autenticado, redirigir a login
    this.router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
