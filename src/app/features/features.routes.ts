import { Routes } from '@angular/router';
import { authGuard, permissionGuard, roleGuard } from '../core/guards/auth.guard';

export const FEATURES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./home/pages/dashboard/main-dashboard.component').then(m => m.MainDashboardComponent),
      },
      {
        path: 'requests',
        canActivate: [permissionGuard],
        data: { permissions: ['solicitudes.ver'] },
        loadComponent: () =>
          import('./workshop/pages/requests/service-requests.component').then(m => m.ServiceRequestsComponent),
      },
      {
        path: 'staff',
        canActivate: [permissionGuard],
        data: { permissions: ['usuarios.ver'] },
        loadComponent: () =>
          import('./workshop/pages/staff/staff-management.component').then(m => m.StaffManagementComponent),
      },
      {
        path: 'inventory',
        canActivate: [permissionGuard],
        data: { permissions: ['inventario.ver'] },
        loadComponent: () =>
          import('./workshop/pages/inventory/inventory-analytics.component').then(m => m.InventoryAnalyticsComponent),
      },
      {
        path: 'analytics',
        canActivate: [permissionGuard],
        data: { permissions: ['talleres.analiticas'] },
        loadComponent: () =>
          import('./workshop/pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
      },
      {
        path: 'users',
        canActivate: [permissionGuard],
        data: { permissions: ['usuarios.ver'] },
        loadComponent: () =>
          import('./admin/pages/users/users-management.component').then(m => m.UsersManagementComponent),
      },
      {
        path: 'roles',
        canActivate: [permissionGuard],
        data: { permissions: ['usuarios.asignar_rol'] },
        loadComponent: () =>
          import('./admin/pages/roles/roles-management.component').then(m => m.RolesManagementComponent),
      },
      {
        path: 'workshops',
        canActivate: [permissionGuard],
        data: { permissions: ['talleres.ver'] },
        loadComponent: () =>
          import('./admin/pages/workshops/workshops-management.component').then(m => m.WorkshopsManagementComponent),
      },
    ],
  },
];
