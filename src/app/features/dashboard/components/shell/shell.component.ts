import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
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

  readonly navItems: NavItem[] = [
    { label: 'Inicio', icon: 'home', route: '/dashboard/home' },
    { label: 'Solicitudes', icon: 'build_circle', route: '/dashboard/requests' },
    { label: 'Personal', icon: 'badge', route: '/dashboard/staff' },
    { label: 'Inventario', icon: 'inventory_2', route: '/dashboard/inventory' },
    { label: 'Análiticas', icon: 'analytics', route: '/dashboard/analytics' },
  ];

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void { this.authService.logout(); }
}
