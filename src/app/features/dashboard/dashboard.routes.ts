import { Routes } from '@angular/router';
import { authGuard, permissionGuard, roleGuard } from '../../core/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/main-dashboard/main-dashboard.component').then(m => m.MainDashboardComponent),
      },
      {
        path: 'requests',
        canActivate: [permissionGuard],
        data: { permissions: ['solicitudes.ver'] },
        loadComponent: () =>
          import('./pages/service-requests/service-requests.component').then(m => m.ServiceRequestsComponent),
      },
      {
        path: 'staff',
        canActivate: [permissionGuard],
        data: { permissions: ['usuarios.ver'] },
        loadComponent: () =>
          import('./pages/staff-management/staff-management.component').then(m => m.StaffManagementComponent),
      },
      {
        path: 'inventory',
        canActivate: [permissionGuard],
        data: { permissions: ['inventario.ver'] },
        loadComponent: () =>
          import('./pages/inventory-analytics/inventory-analytics.component').then(m => m.InventoryAnalyticsComponent),
      },
      {
        path: 'analytics',
        canActivate: [roleGuard],
        data: { roles: ['Administrador', 'Propietario'] },
        loadComponent: () =>
          import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['Administrador'] },
        loadComponent: () =>
          import('./pages/users-management/users-management.component').then(m => m.UsersManagementComponent),
      },
      {
        path: 'roles',
        canActivate: [roleGuard],
        data: { roles: ['Administrador'] },
        loadComponent: () =>
          import('./pages/roles-management/roles-management.component').then(m => m.RolesManagementComponent),
      },
      {
        path: 'workshops',
        canActivate: [roleGuard],
        data: { roles: ['Administrador', 'Propietario'] },
        loadComponent: () =>
          import('./pages/workshops-management/workshops-management.component').then(m => m.WorkshopsManagementComponent),
      },
    ],
  },
];
