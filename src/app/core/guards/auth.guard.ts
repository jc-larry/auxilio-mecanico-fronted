import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredPermissions = route.data['permissions'] as string[] | undefined;
  
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  
  const userPerms = authService.currentUser()?.permissions || [];
  const hasPermission = requiredPermissions.every(p => userPerms.includes(p));
  
  if (hasPermission) return true;
  return router.createUrlTree(['/dashboard/home']);
};

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[] | undefined;
  
  if (!requiredRoles || requiredRoles.length === 0) return true;
  
  const userRoles = authService.currentUser()?.roles || [];
  const hasRole = requiredRoles.some(r => userRoles.includes(r));
  
  if (hasRole) return true;
  return router.createUrlTree(['/dashboard/home']);
};
