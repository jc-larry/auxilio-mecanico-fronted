import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PRIORITY_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  ServiceRequest,
  ServiceRequestCreate,
  ServiceRequestStats,
  ServiceRequestUpdate,
  Status,
  STATUS_OPTIONS,
} from '../../../../core/models/service-request.models';
import { NotificationService } from '../../../../core/services/notification.service';
import { ServiceRequestService } from '../../../../core/services/service-request.service';

@Component({
  selector: 'app-service-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-request.component.html',
})
export class ServiceRequestsComponent implements OnInit {
  // ── State ──
  readonly requests = signal<ServiceRequest[]>([]);
  readonly stats = signal<ServiceRequestStats>({
    total_queue: 0,
    avg_lead_time_hours: 0,
    critical_count: 0,
    completion_rate: 0,
  });
  readonly loading = signal(true);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly perPage = 10;
  readonly statusFilter = signal<Status | null>(null);

  // ── Modal state ──
  readonly showCreateModal = signal(false);
  readonly showAssignModal = signal(false);
  readonly assignTarget = signal<ServiceRequest | null>(null);
  readonly assignMechanicName = signal('');
  readonly creating = signal(false);

  // ── Form model ──
  readonly newRequest = signal<ServiceRequestCreate>({
    client_name: '',
    vehicle_info: '',
    service_type: 'general',
    description: '',
    location: '',
    priority: 'media',
  });

  // ── Options for selects ──
  readonly serviceTypeOptions = SERVICE_TYPE_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;
  readonly priorityOptions = PRIORITY_OPTIONS;

  // ── Computed ──
  readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  readonly activeFilterLabel = computed(() => {
    const filter = this.statusFilter();
    if (!filter) return 'Todos';
    return STATUS_OPTIONS.find(o => o.value === filter)?.label ?? filter;
  });

  constructor(
    private srService: ServiceRequestService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadStats();
  }

  // ── Data loading ──

  loadRequests(): void {
    this.loading.set(true);
    const filter = this.statusFilter() ?? undefined;
    this.srService.list(this.currentPage(), this.perPage, filter).subscribe({
      next: (res) => {
        this.requests.set(res.items);
        this.totalPages.set(res.pages);
        this.totalItems.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar solicitudes');
        this.loading.set(false);
      },
    });
  }

  loadStats(): void {
    this.srService.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {},
    });
  }

  // ── Pagination ──

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadRequests();
  }

  // ── Filters ──

  onFilterChange(status: Status | null): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.loadRequests();
  }

  // ── Create ──

  openCreateModal(): void {
    this.newRequest.set({
      client_name: '',
      vehicle_info: '',
      service_type: 'general',
      description: '',
      location: '',
      priority: 'media',
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  onCreateSubmit(): void {
    const data = this.newRequest();
    if (!data.client_name || !data.vehicle_info || !data.location) {
      this.notify.error('Complete los campos obligatorios');
      return;
    }
    this.creating.set(true);
    this.srService.create(data).subscribe({
      next: () => {
        this.notify.success('Solicitud creada exitosamente');
        this.closeCreateModal();
        this.creating.set(false);
        this.loadRequests();
        this.loadStats();
      },
      error: () => {
        this.notify.error('Error al crear solicitud');
        this.creating.set(false);
      },
    });
  }

  updateFormField(field: keyof ServiceRequestCreate, value: string): void {
    this.newRequest.update(current => ({ ...current, [field]: value }));
  }

  // ── Assign mechanic ──

  openAssignModal(req: ServiceRequest): void {
    this.assignTarget.set(req);
    this.assignMechanicName.set(req.assigned_mechanic ?? '');
    this.showAssignModal.set(true);
  }

  closeAssignModal(): void {
    this.showAssignModal.set(false);
    this.assignTarget.set(null);
  }

  onAssignSubmit(): void {
    const target = this.assignTarget();
    const name = this.assignMechanicName().trim();
    if (!target || !name) {
      this.notify.error('Ingrese el nombre del mecánico');
      return;
    }

    const update: ServiceRequestUpdate = {
      assigned_mechanic: name,
      status: 'EN_PROGRESO',
    };

    this.srService.update(target.id, update).subscribe({
      next: () => {
        this.notify.success(`Mecánico "${name}" asignado a ${target.code}`);
        this.closeAssignModal();
        this.loadRequests();
        this.loadStats();
      },
      error: () => this.notify.error('Error al asignar mecánico'),
    });
  }

  // ── Status changes ──

  onUpdateStatus(req: ServiceRequest, newStatus: Status): void {
    this.srService.update(req.id, { status: newStatus }).subscribe({
      next: () => {
        const label = STATUS_OPTIONS.find(o => o.value === newStatus)?.label ?? newStatus;
        this.notify.success(`${req.code} → ${label}`);
        this.loadRequests();
        this.loadStats();
      },
      error: () => this.notify.error('Error al actualizar estado'),
    });
  }

  // ── Delete ──

  onDelete(req: ServiceRequest): void {
    if (!confirm(`¿Eliminar la solicitud ${req.code}? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.srService.delete(req.id).subscribe({
      next: () => {
        this.notify.success(`Solicitud ${req.code} eliminada`);
        this.loadRequests();
        this.loadStats();
      },
      error: () => this.notify.error('Error al eliminar solicitud'),
    });
  }

  // ── Helpers ──

  getTimelineColor(status: string): string {
    switch (status) {
      case 'PENDIENTE': return '#cfdaf2';
      case 'EN_PROGRESO': return '#fd761a';
      case 'CRITICO': return '#ff5250';
      case 'COMPLETADO': return '#10b981';
      default: return '#cfdaf2';
    }
  }

  getMechanicInitials(name: string | null): string {
    if (!name) return '';
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  getStatusLabel(status: string): string {
    return STATUS_OPTIONS.find(o => o.value === status)?.label ?? status;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
