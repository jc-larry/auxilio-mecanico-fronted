import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
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

  expandedMenus = signal<Set<string>>(new Set());

  readonly allNavItems: NavItem[] = [
    // ── Acceso para todos los usuarios ──────────────────────────────────────
    { label: 'Inicio', icon: 'home', route: '/dashboard/home' },

    // ── Módulo Administrativo (Configuración Global) ─────────────────────────
    {
      label: 'Módulo Administrativo',
      icon: 'admin_panel_settings',
      requiredPermission: 'usuarios.asignar_rol', // Solo el Administrador (SuperUser) suele asignar roles
      children: [
        {
          label: 'Gestión de Usuarios',
          icon: 'person_search',
          route: '/dashboard/users',
          requiredPermission: 'usuarios.ver',
        },
        {
          label: 'Gestión de Roles',
          icon: 'security',
          route: '/dashboard/roles',
          requiredPermission: 'usuarios.asignar_rol',
        },
        {
          label: 'Visualizar Bitácora',
          icon: 'history',
          route: '/dashboard/audit-log',
          requiredPermission: 'bitacora.ver',
        },
      ],
    },

    // ── Módulo Taller (Operación Diaria) ─────────────────────────────────────
    {
      label: 'Módulo Taller',
      icon: 'work',
      requiredPermission: 'solicitudes.ver',
      children: [
        {
          label: 'Gestión de Solicitudes',
          icon: 'build_circle',
          route: '/dashboard/requests',
          requiredPermission: 'solicitudes.ver',
        },
        {
          label: 'Gestión de Personal',
          icon: 'engineering',
          route: '/dashboard/staff',
          requiredPermission: 'usuarios.ver', // El Propietario ahora tiene este permiso en el seed
        },
        {
          label: 'Gestión de Inventario',
          icon: 'inventory_2',
          route: '/dashboard/inventory',
          requiredPermission: 'inventario.ver',
        },
        {
          label: 'Analíticas',
          icon: 'analytics',
          route: '/dashboard/analytics',
          requiredPermission: 'talleres.analiticas',
        },
      ],
    },
  ];

  navItems = computed(() => {
    const permissions = this.user()?.permissions || [];
    const roles = this.user()?.roles || [];

    const filterItems = (items: NavItem[]): NavItem[] => {
      return items.reduce((acc: NavItem[], item) => {
        const hasPermission = !item.requiredPermission || permissions.includes(item.requiredPermission);
        const hasRole = !item.requiredRole || 
                         item.requiredRole.split(',').some(r => roles.includes(r.trim()));

        if (hasPermission && hasRole) {
          if (item.children) {
            const filteredChildren = filterItems(item.children);
            // Hide parent if it has children defined but none are accessible
            if (filteredChildren.length > 0) {
              acc.push({ ...item, children: filteredChildren });
            }
          } else {
            acc.push(item);
          }
        }
        return acc;
      }, []);
    };

    return filterItems(this.allNavItems);
  });

  constructor(private authService: AuthService, private router: Router) { }

  toggleMenu(label: string): void {
    const current = new Set(this.expandedMenus());
    if (current.has(label)) {
      current.delete(label);
    } else {
      current.add(label);
    }
    this.expandedMenus.set(current);
  }

  isExpanded(label: string): boolean {
    return this.expandedMenus().has(label);
  }

  logout(): void { this.authService.logout(); }
}
