import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InventoryItem,
  InventoryItemCreate,
  InventoryItemUpdate,
  InventoryStats,
  SYSTEM_CATEGORY_OPTIONS,
} from '../../../../core/models/inventory.models';
import { InventoryService } from '../../../../core/services/inventory.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
})
export class InventoryAnalyticsComponent implements OnInit {
  // ── State ──
  readonly items = signal<InventoryItem[]>([]);
  readonly stats = signal<InventoryStats>({
    total_items: 0, total_units: 0, critical_count: 0, total_value: 0,
  });
  readonly loading = signal(true);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly perPage = 10;
  readonly criticalFilter = signal(false);

  // ── Modals ──
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showRestockModal = signal(false);
  readonly editTarget = signal<InventoryItem | null>(null);
  readonly restockTarget = signal<InventoryItem | null>(null);
  readonly restockQty = signal(0);
  readonly creating = signal(false);

  // ── Form ──
  readonly newItem = signal<InventoryItemCreate>({
    name: '', sku: '', system_category: 'general', quantity: 0, min_stock: 5, unit_price: 0,
  });

  readonly editForm = signal<InventoryItemUpdate>({});

  // ── Options ──
  readonly categoryOptions = SYSTEM_CATEGORY_OPTIONS;

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  constructor(
    private invService: InventoryService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadStats();
  }

  // ── Data ──

  loadItems(): void {
    this.loading.set(true);
    this.invService.list(this.currentPage(), this.perPage, this.criticalFilter()).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.totalPages.set(res.pages);
        this.totalItems.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar inventario');
        this.loading.set(false);
      },
    });
  }

  loadStats(): void {
    this.invService.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => {},
    });
  }

  // ── Pagination ──

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadItems();
  }

  // ── Filter ──

  toggleCriticalFilter(): void {
    this.criticalFilter.update(v => !v);
    this.currentPage.set(1);
    this.loadItems();
  }

  // ── Create ──

  openCreateModal(): void {
    this.newItem.set({
      name: '', sku: '', system_category: 'general', quantity: 0, min_stock: 5, unit_price: 0,
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void { this.showCreateModal.set(false); }

  updateCreateField(field: keyof InventoryItemCreate, value: string | number): void {
    this.newItem.update(c => ({ ...c, [field]: value }));
  }

  onCreateSubmit(): void {
    const d = this.newItem();
    if (!d.name || !d.sku) {
      this.notify.error('Nombre y SKU son obligatorios');
      return;
    }
    this.creating.set(true);
    this.invService.create(d).subscribe({
      next: () => {
        this.notify.success('Artículo agregado al inventario');
        this.closeCreateModal();
        this.creating.set(false);
        this.loadItems();
        this.loadStats();
      },
      error: (err) => {
        const msg = err.error?.detail ?? 'Error al crear artículo';
        this.notify.error(msg);
        this.creating.set(false);
      },
    });
  }

  // ── Edit ──

  openEditModal(item: InventoryItem): void {
    this.editTarget.set(item);
    this.editForm.set({
      name: item.name,
      system_category: item.system_category,
      quantity: item.quantity,
      min_stock: item.min_stock,
      unit_price: item.unit_price,
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editTarget.set(null);
  }

  updateEditField(field: string, value: string | number): void {
    this.editForm.update(c => ({ ...c, [field]: value }));
  }

  onEditSubmit(): void {
    const target = this.editTarget();
    if (!target) return;

    console.log('Updating item with ID:', target.id, this.editForm());
    this.invService.update(target.id, this.editForm()).subscribe({
      next: () => {
        this.notify.success(`${target.name} actualizado`);
        this.closeEditModal();
        this.loadItems();
        this.loadStats();
      },
      error: () => this.notify.error('Error al actualizar'),
    });
  }

  // ── Restock ──

  openRestockModal(item: InventoryItem): void {
    this.restockTarget.set(item);
    this.restockQty.set(10);
    this.showRestockModal.set(true);
  }

  closeRestockModal(): void {
    this.showRestockModal.set(false);
    this.restockTarget.set(null);
  }

  onRestockSubmit(): void {
    const target = this.restockTarget();
    const qty = this.restockQty();
    if (!target || qty <= 0) {
      this.notify.error('Ingrese una cantidad válida');
      return;
    }

    this.invService.restock(target.id, qty).subscribe({
      next: (updated) => {
        this.notify.success(`${target.name}: +${qty} unidades (total: ${updated.quantity})`);
        this.closeRestockModal();
        this.loadItems();
        this.loadStats();
      },
      error: () => this.notify.error('Error al reabastecer'),
    });
  }

  // ── Delete ──

  onDelete(item: InventoryItem): void {
    if (!confirm(`¿Eliminar "${item.name}" (${item.sku})? Esta acción no se puede deshacer.`)) return;
    this.invService.delete(item.id).subscribe({
      next: () => {
        this.notify.success(`${item.name} eliminado`);
        this.loadItems();
        this.loadStats();
      },
      error: () => this.notify.error('Error al eliminar'),
    });
  }

  // ── Helpers ──

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatTotalValue(value: number): string {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(2)}`;
  }
}
