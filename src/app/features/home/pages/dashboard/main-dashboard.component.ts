import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnalyticsSummary } from '../../../../core/models/analytics.models';
import { InventoryItem } from '../../../../core/models/inventory.models';
import { Mechanic } from '../../../../core/models/mechanic.models';
import { ServiceRequest, ServiceRequestUpdate, Status, STATUS_OPTIONS } from '../../../../core/models/service-request.models';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { AuthService } from '../../../../core/services/auth.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import { MechanicService } from '../../../../core/services/mechanic.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ServiceRequestService } from '../../../../core/services/service-request.service';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './main-dashboard.component.html',
})
export class MainDashboardComponent implements OnInit {
  // ── State ──
  readonly loading = signal(true);
  readonly summary = signal<AnalyticsSummary>({
    total_requests: 0, active_requests: 0, completed_requests: 0, 
    total_mechanics: 0, available_mechanics: 0, total_parts: 0, 
    critical_parts: 0, inventory_value: 0
  });
  readonly requests = signal<ServiceRequest[]>([]);
  readonly technicians = signal<Mechanic[]>([]);
  readonly inventoryAlerts = signal<InventoryItem[]>([]);

  // ── Assign Modal ──
  readonly showAssignModal = signal(false);
  readonly assignTarget = signal<ServiceRequest | null>(null);
  readonly assignMechanicName = signal('');

  user = computed(() => this.authService.currentUser());

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private srService: ServiceRequestService,
    private mecService: MechanicService,
    private invService: InventoryService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    
    // KPIs
    this.analyticsService.getAnalytics().subscribe({
      next: (data) => {
        this.summary.set(data.summary);
      }
    });

    // Últimas solicitudes creadas (6)
    this.srService.list(1, 6).subscribe({
      next: (res) => this.requests.set(res.items)
    });

    // Técnicos
    this.mecService.list(1, 10).subscribe({
      next: (res) => this.technicians.set(res.items)
    });

    // Inventario Crítico
    this.invService.list(1, 5, true).subscribe({
      next: (res) => this.inventoryAlerts.set(res.items)
    });
  }

  // ── Modals / Actions ──

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
        this.notify.success(`Mecánico asignado a ${target.code}`);
        this.closeAssignModal();
        this.loadData();
      },
      error: () => this.notify.error('Error al asignar mecánico'),
    });
  }

  onRejectJob(req: ServiceRequest): void {
    if (!confirm(`¿Estás seguro de rechazar la solicitud ${req.code}?`)) return;

    this.srService.update(req.id, { status: 'RECHAZADO' }).subscribe({
      next: () => {
        this.notify.success(`Solicitud ${req.code} rechazada`);
        this.loadData();
      },
      error: () => this.notify.error('Error al rechazar solicitud'),
    });
  }

  // ── Helpers UI ──
  
  getUrgencyLabel(priority: string): string {
    return priority === 'alta' ? 'ALTA URGENCIA' : priority === 'media' ? 'MED URGENCIA' : 'BAJA URGENCIA';
  }

  getStatusLabel(status: string): string {
    return STATUS_OPTIONS.find(o => o.value === status)?.label?.toUpperCase() ?? status;
  }

  getGradient(priority: string): string {
    if (priority === 'alta') return 'linear-gradient(160deg, #1e3a5f 0%, #0d1f35 100%)';
    if (priority === 'media') return 'linear-gradient(160deg, #2d4a6e 0%, #1a2d44 100%)';
    return 'linear-gradient(160deg, #3a3a4e 0%, #22222e 100%)';
  }

  timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return diffMins < 1 ? 'just now' : `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }
}
