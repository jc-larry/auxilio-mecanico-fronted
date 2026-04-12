import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  user = computed(() => this.authService.currentUser());

  initials = computed(() => {
    const name = this.user()?.full_name ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  });

  profileFields = computed(() => {
    const u = this.user();
    if (!u) return [];
    return [
      { label: 'Nombre completo', value: u.full_name, badge: false, badgeClass: '' },
      { label: 'Correo electrónico', value: u.email, badge: false, badgeClass: '' },
      { label: 'Nombre de usuario', value: `@${u.username}`, badge: false, badgeClass: '' },
      {
        label: 'Estado de la cuenta',
        value: u.is_active ? 'Activo' : 'Inactivo',
        badge: true,
        badgeClass: u.is_active
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          : 'bg-red-50 text-red-700 border border-red-100',
      },
      {
        label: 'Verificado',
        value: u.is_verified ? 'Verificado' : 'Pendiente',
        badge: true,
        badgeClass: u.is_verified
          ? 'bg-blue-50 text-blue-700 border border-blue-100'
          : 'bg-amber-50 text-amber-700 border border-amber-100',
      },
      {
        label: 'Último inicio de sesión',
        value: u.last_login ? new Date(u.last_login).toLocaleString() : 'Primera sesión',
        badge: false,
        badgeClass: '',
      },
    ];
  });

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
  }
}
