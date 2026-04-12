import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  AnalyticsSummary,
  DashboardAnalytics,
  InventoryBySystem,
  MechanicWorkload,
  RequestByDay,
  RequestByStatus,
  RequestByType,
} from '../../../../core/models/analytics.models';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  readonly loading = signal(true);
  readonly requestsByDay = signal<RequestByDay[]>([]);
  readonly requestsByType = signal<RequestByType[]>([]);
  readonly requestsByStatus = signal<RequestByStatus[]>([]);
  readonly mechanicWorkload = signal<MechanicWorkload[]>([]);
  readonly inventoryBySystem = signal<InventoryBySystem[]>([]);
  readonly summary = signal<AnalyticsSummary>({
    total_requests: 0,
    active_requests: 0,
    completed_requests: 0,
    total_mechanics: 0,
    available_mechanics: 0,
    total_parts: 0,
    critical_parts: 0,
    inventory_value: 0,
  });

  constructor(
    private analyticsService: AnalyticsService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading.set(true);
    this.analyticsService.getAnalytics().subscribe({
      next: (data) => {
        this.requestsByDay.set(data.requests_by_day);
        this.requestsByType.set(data.requests_by_type);
        this.requestsByStatus.set(data.requests_by_status);
        this.mechanicWorkload.set(data.mechanic_workload);
        this.inventoryBySystem.set(data.inventory_by_system);
        this.summary.set(data.summary);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar analíticas');
        this.loading.set(false);
      },
    });
  }

  // ── Computed helpers for SVG donut ──

  get totalRequests(): number {
    return this.requestsByType().reduce((sum, t) => sum + t.count, 0) || 0;
  }

  getDonutSegments(): { offset: number; length: number; color: string }[] {
    const total = this.totalRequests || 1;
    const circumference = 2 * Math.PI * 46; // r=46
    let currentOffset = 0;
    const segments: { offset: number; length: number; color: string }[] = [];

    for (const t of this.requestsByType()) {
      const length = (t.count / total) * circumference;
      segments.push({
        offset: -currentOffset,
        length,
        color: t.color,
      });
      currentOffset += length;
    }

    return segments;
  }

  getDonutDashArray(segment: { length: number }): string {
    const circumference = 2 * Math.PI * 46;
    return `${segment.length} ${circumference - segment.length}`;
  }

  formatCurrency(value: number): string {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value.toFixed(2)}`;
  }

  getMaxWorkload(): number {
    return Math.max(...this.mechanicWorkload().map(m => m.assigned_count), 1);
  }
}
