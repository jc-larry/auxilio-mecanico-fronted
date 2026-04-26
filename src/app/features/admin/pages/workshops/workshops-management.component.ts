import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Workshop, WorkshopCreate, WorkshopUpdate } from '../../../../core/models/workshop.models';
import { WorkshopService } from '../../../../core/services/workshop.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-workshops-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workshops-management.component.html',
})
export class WorkshopsManagementComponent implements OnInit {
  // ── State ──
  readonly workshops = signal<Workshop[]>([]);
  readonly loading = signal(true);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly perPage = 10;

  // ── Modal state ──
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly editTarget = signal<Workshop | null>(null);
  readonly submitting = signal(false);

  // ── Form models ──
  readonly newWorkshop = signal<WorkshopCreate>({
    nombre: '',
    direccion: '',
    latitud: 0,
    longitud: 0,
    telefono: '',
    estado: true,
  });

  readonly editForm = signal<WorkshopUpdate>({});

  readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor(
    private workshopService: WorkshopService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.loading.set(true);
    this.workshopService.list(this.currentPage(), this.perPage).subscribe({
      next: (res) => {
        this.workshops.set(res.items);
        this.totalPages.set(res.pages);
        this.totalItems.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar talleres');
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadWorkshops();
  }

  // ── Create ──
  openCreateModal(): void {
    this.newWorkshop.set({
      nombre: '',
      direccion: '',
      latitud: 0,
      longitud: 0,
      telefono: '',
      estado: true,
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  onCreateSubmit(): void {
    const data = this.newWorkshop();
    if (!data.nombre || !data.direccion) {
      this.notify.error('Nombre y dirección son obligatorios');
      return;
    }
    this.submitting.set(true);
    this.workshopService.create(data).subscribe({
      next: () => {
        this.notify.success('Taller registrado exitosamente');
        this.closeCreateModal();
        this.submitting.set(false);
        this.loadWorkshops();
      },
      error: () => {
        this.notify.error('Error al registrar taller');
        this.submitting.set(false);
      },
    });
  }

  updateCreateField(field: keyof WorkshopCreate, value: any): void {
    this.newWorkshop.update(current => ({ ...current, [field]: value }));
  }

  // ── Edit ──
  openEditModal(w: Workshop): void {
    this.editTarget.set(w);
    this.editForm.set({
      nombre: w.nombre,
      direccion: w.direccion,
      latitud: w.latitud,
      longitud: w.longitud,
      telefono: w.telefono,
      estado: w.estado,
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editTarget.set(null);
  }

  updateEditField(field: keyof WorkshopUpdate, value: any): void {
    this.editForm.update(current => ({ ...current, [field]: value }));
  }

  onEditSubmit(): void {
    const target = this.editTarget();
    if (!target) return;

    this.submitting.set(true);
    this.workshopService.update(target.id, this.editForm()).subscribe({
      next: () => {
        this.notify.success('Taller actualizado');
        this.closeEditModal();
        this.submitting.set(false);
        this.loadWorkshops();
      },
      error: () => {
        this.notify.error('Error al actualizar taller');
        this.submitting.set(false);
      },
    });
  }

  // ── Delete ──
  onDelete(w: Workshop): void {
    if (!confirm(`¿Eliminar el taller ${w.nombre}?`)) return;
    this.workshopService.delete(w.id).subscribe({
      next: () => {
        this.notify.success('Taller eliminado');
        this.loadWorkshops();
      },
      error: () => this.notify.error('Error al eliminar taller'),
    });
  }
}
