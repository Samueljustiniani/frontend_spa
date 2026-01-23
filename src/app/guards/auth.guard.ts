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
      // Verificar roles si se especifican en la ruta
      const requiredRoles = route.data['roles'] as string[] | undefined;
      if (requiredRoles) {
        const userRole = this.authService.getUserRole();
        if (userRole && requiredRoles.includes(userRole)) {
          return true;
        }
        // Usuario no tiene el rol requerido
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }
    
    // No autenticado, redirigir a login
    this.router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
