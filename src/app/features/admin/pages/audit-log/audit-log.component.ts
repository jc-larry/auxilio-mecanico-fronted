import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { BitacoraService, AuditLog } from '../../../../core/services/bitacora.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-log.component.html',
})
export class AuditLogComponent implements OnInit {
  private bitacoraService = inject(BitacoraService);

  logs = signal<AuditLog[]>([]);
  total = signal(0);
  currentPage = signal(1);
  perPage = signal(20);
  totalPages = signal(1);
  loading = signal(false);

  pages = signal<number[]>([]);

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(page: number = 1): void {
    this.loading.set(true);
    this.bitacoraService.getLogs(page, this.perPage()).subscribe({
      next: (response) => {
        this.logs.set(response.items);
        this.total.set(response.total);
        this.currentPage.set(response.page);
        this.totalPages.set(response.pages);
        this.pages.set(Array.from({ length: response.pages }, (_, i) => i + 1));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading audit logs', err);
        this.loading.set(false);
      },
    });
  }

  onPageChange(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.loadLogs(newPage);
    }
  }

  getActionLabel(accion: string): string {
    const labels: Record<string, string> = {
      'INICIO_SESION': 'Inicio de Sesión',
      'NUEVO_USUARIO': 'Nuevo Usuario',
      'ACTIVAR_USUARIO': 'Activar Usuario',
      'DESACTIVAR_USUARIO': 'Desactivar Usuario',
      'ASIGNAR_MECANICO': 'Asignar Mecánico',
      'ACTUALIZAR_ESTADO': 'Actualizar Estado',
      'CAMBIAR_DISPONIBILIDAD': 'Cambiar Disponibilidad',
    };
    return labels[accion] || accion;
  }

  getActionClasses(accion: string): string {
    const map: Record<string, string> = {
      'INICIO_SESION': 'bg-primary/10 text-primary',
      'NUEVO_USUARIO': 'bg-emerald-500/10 text-emerald-600',
      'ACTIVAR_USUARIO': 'bg-emerald-500/10 text-emerald-600',
      'DESACTIVAR_USUARIO': 'bg-red-500/10 text-red-600',
      'ASIGNAR_MECANICO': 'bg-secondary/10 text-secondary',
      'ACTUALIZAR_ESTADO': 'bg-amber-500/10 text-amber-600',
      'CAMBIAR_DISPONIBILIDAD': 'bg-amber-500/10 text-amber-600',
    };
    return map[accion] || 'bg-outline-variant/10 text-on-surface-variant';
  }

  getEntityLabel(entidad: string): string {
    const labels: Record<string, string> = {
      'Usuario': 'Usuario',
      'SolicitudServicio': 'Solicitud',
      'Mecanico': 'Mecánico',
    };
    return labels[entidad] || entidad;
  }

  formatDetails(detalles: any): string {
    if (!detalles) return '';
    const parts: string[] = [];
    if (detalles.email) parts.push(detalles.email);
    if (detalles.codigo) parts.push(detalles.codigo);
    if (detalles.nuevo_estado) parts.push(detalles.nuevo_estado);
    if (detalles.disponible !== undefined) parts.push(detalles.disponible ? 'Disponible' : 'No disponible');
    if (detalles.roles) parts.push(detalles.roles.join(', '));
    return parts.join(' · ') || JSON.stringify(detalles);
  }
}
