import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

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
        loadComponent: () =>
          import('./pages/service-requests/service-requests.component').then(m => m.ServiceRequestsComponent),
      },
      {
        path: 'staff',
        loadComponent: () =>
          import('./pages/staff-management/staff-management.component').then(m => m.StaffManagementComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./pages/inventory-analytics/inventory-analytics.component').then(m => m.InventoryAnalyticsComponent),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
      },
    ],
  },
];
