import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceType, ServiceTypeCreate, ServiceTypeUpdate } from '../../../../core/models/service-type.models';
import { ServiceTypeService } from '../../../../core/services/service-type.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-service-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-types.component.html',
})
export class ServiceTypesComponent implements OnInit {
  // ── State ──
  readonly serviceTypes = signal<ServiceType[]>([]);
  readonly loading = signal(true);
  
  // ── Pagination ──
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly perPage = 10;
  
  readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  // ── Modals ──
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly creating = signal(false);

  // ── Forms ──
  readonly newServiceType = signal<ServiceTypeCreate>({
    nombre: '',
    descripcion: '',
    precio_base: 0
  });

  readonly editTarget = signal<ServiceType | null>(null);
  readonly editForm = signal<ServiceTypeUpdate>({});

  currentUser = computed(() => this.authService.currentUser());

  constructor(
    private serviceTypeService: ServiceTypeService,
    private notify: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadServiceTypes();
  }

  loadServiceTypes(): void {
    this.loading.set(true);
    this.serviceTypeService.list(this.currentPage(), this.perPage).subscribe({
      next: (res) => {
        this.serviceTypes.set(res.items);
        this.totalPages.set(res.pages);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar ofertas de servicio');
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadServiceTypes();
  }

  // ── Create Modal ──
  openCreateModal(): void {
    this.newServiceType.set({
      nombre: '',
      descripcion: '',
      precio_base: 0
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  updateCreateField(field: keyof ServiceTypeCreate, value: any): void {
    this.newServiceType.update(current => ({ ...current, [field]: value }));
  }

  onCreateSubmit(): void {
    const data = this.newServiceType();
    if (!data.nombre || data.precio_base < 0) {
      this.notify.error('Por favor complete los campos obligatorios correctamente');
      return;
    }
    this.creating.set(true);
    this.serviceTypeService.create(data).subscribe({
      next: () => {
        this.notify.success('Oferta de servicio creada');
        this.closeCreateModal();
        this.loadServiceTypes();
        this.creating.set(false);
      },
      error: (err) => {
        const msg = err.error?.detail || 'Error al crear la oferta de servicio';
        this.notify.error(msg);
        this.creating.set(false);
      }
    });
  }

  // ── Edit Modal ──
  openEditModal(st: ServiceType): void {
    this.editTarget.set(st);
    this.editForm.set({
      nombre: st.nombre,
      descripcion: st.descripcion,
      precio_base: st.precio_base
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editTarget.set(null);
  }

  updateEditField(field: keyof ServiceTypeUpdate, value: any): void {
    this.editForm.update(current => ({ ...current, [field]: value }));
  }

  onEditSubmit(): void {
    const target = this.editTarget();
    if (!target) return;
    
    const data = this.editForm();
    if (!data.nombre || (data.precio_base !== undefined && data.precio_base < 0)) {
        this.notify.error('Datos inválidos');
        return;
    }

    this.serviceTypeService.update(target.id, data).subscribe({
      next: () => {
        this.notify.success('Oferta de servicio actualizada');
        this.closeEditModal();
        this.loadServiceTypes();
      },
      error: (err) => {
        const msg = err.error?.detail || 'Error al actualizar la oferta de servicio';
        this.notify.error(msg);
      }
    });
  }

  // ── Delete ──
  onDelete(st: ServiceType): void {
    if (!confirm(`¿Eliminar la oferta de servicio "${st.nombre}"?`)) return;

    this.serviceTypeService.delete(st.id).subscribe({
      next: () => {
        this.notify.success('Oferta de servicio eliminada');
        this.loadServiceTypes();
      },
      error: (err) => {
        const msg = err.error?.detail || 'Error al eliminar la oferta de servicio';
        this.notify.error(msg);
      }
    });
  }
}
