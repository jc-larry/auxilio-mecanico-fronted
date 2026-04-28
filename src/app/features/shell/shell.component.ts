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

  isCollapsed = signal<boolean>(false);
  expandedMenus = signal<Set<string>>(new Set());

  readonly allNavItems: NavItem[] = [
    // ── Acceso para todos los usuarios ──────────────────────────────────────
    { label: 'Inicio', icon: 'home', route: '/dashboard/home' },

    // ── Módulo Administrativo (Configuración Global) ─────────────────────────
    {
      label: 'Administración',
      icon: 'admin_panel_settings',
      requiredRole: 'Administrador, Propietario',
      children: [
        {
          label: 'Gestionar Usuarios',
          icon: 'manage_accounts',
          route: '/dashboard/users',
          requiredRole: 'Administrador'
        },
        {
          label: 'Gestionar Roles',
          icon: 'security',
          route: '/dashboard/roles',
          requiredPermission: 'roles.ver',
        },
        {
          label: 'Visualizar Bitácora',
          icon: 'history',
          route: '/dashboard/audit-log',
          requiredPermission: 'bitacora.ver',
        },
        {
          label: 'Ofertas de Servicio',
          icon: 'handyman',
          route: '/dashboard/services',
          requiredPermission: 'servicios.ver',
        },
        {
          label: 'Gestionar Talleres',
          icon: 'home_repair_service',
          route: '/dashboard/workshops',
          requiredPermission: 'talleres.ver',
        },
      ],
    },

    // ── Módulo Taller (Operación Diaria) ─────────────────────────────────────
    {
      label: 'Mi Taller',
      icon: 'work',
      requiredPermission: 'solicitudes.ver, usuarios.ver, inventario.ver, talleres.analiticas',
      children: [
        {
          label: 'Solicitudes',
          icon: 'build_circle',
          route: '/dashboard/requests',
          requiredPermission: 'solicitudes.ver',
        },
        {
          label: 'Personal',
          icon: 'engineering',
          route: '/dashboard/staff',
          requiredPermission: 'usuarios.ver',
        },
        {
          label: 'Inventario',
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
    const tallerId = this.user()?.taller_id;

    const filterItems = (items: NavItem[]): NavItem[] => {
      return items.reduce((acc: NavItem[], item) => {
        let currentItem = { ...item };
        
        // Filter out "Mi Taller" if no workshop is registered
        if (currentItem.label === 'Mi Taller' && !tallerId) {
          return acc;
        }

        const hasPermission = !currentItem.requiredPermission || 
                              currentItem.requiredPermission.split(',').some(p => permissions.includes(p.trim()));
        const hasRole = !currentItem.requiredRole || 
                         currentItem.requiredRole.split(',').some(r => roles.includes(r.trim()));

        if (hasPermission && hasRole) {
          if (currentItem.children) {
            const filteredChildren = filterItems(currentItem.children);
            if (filteredChildren.length > 0) {
              acc.push({ ...currentItem, children: filteredChildren });
            }
          } else {
            acc.push(currentItem);
          }
        }
        return acc;
      }, []);
    };

    return filterItems(this.allNavItems);
  });

  constructor(private authService: AuthService, private router: Router) { }

  toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

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
