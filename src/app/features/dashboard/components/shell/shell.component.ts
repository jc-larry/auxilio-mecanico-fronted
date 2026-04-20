import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  requiredPermission?: string;
  requiredRole?: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  user = computed(() => this.authService.currentUser());
  initials = computed(() => {
    const name = this.user()?.full_name ?? '';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  });

  readonly allNavItems: NavItem[] = [
    { label: 'Inicio', icon: 'home', route: '/dashboard/home' },
    { label: 'Solicitudes', icon: 'build_circle', route: '/dashboard/requests', requiredPermission: 'solicitudes.ver' },
    { label: 'Personal', icon: 'badge', route: '/dashboard/staff', requiredPermission: 'usuarios.ver' },
    { label: 'Inventario', icon: 'inventory_2', route: '/dashboard/inventory', requiredPermission: 'inventario.ver' },
    { label: 'Usuarios', icon: 'manage_accounts', route: '/dashboard/users', requiredRole: 'Administrador' },
    { label: 'Análiticas', icon: 'analytics', route: '/dashboard/analytics', requiredRole: 'Administrador' },
  ];

  navItems = computed(() => {
    const permissions = this.user()?.permissions || [];
    const roles = this.user()?.roles || [];
    
    return this.allNavItems.filter(item => {
      if (item.requiredPermission && !permissions.includes(item.requiredPermission)) {
        return false;
      }
      if (item.requiredRole && !roles.includes(item.requiredRole) && !roles.includes('Supervisor')) {
        return false;
      }
      return true;
    });
  });

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void { this.authService.logout(); }
}
