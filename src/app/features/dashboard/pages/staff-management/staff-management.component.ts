import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AVATAR_COLORS,
  EXPERTISE_OPTIONS,
  Mechanic,
  MechanicCreate,
  MechanicStats,
  MechanicUpdate,
  SPECIALTY_OPTIONS,
} from '../../../../core/models/mechanic.models';
import { MechanicService } from '../../../../core/services/mechanic.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkshopService } from '../../../../core/services/workshop.service';
import { Workshop } from '../../../../core/models/workshop.models';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.component.html',
})
export class StaffManagementComponent implements OnInit {
  // ── State ──
  readonly staff = signal<Mechanic[]>([]);
  readonly stats = signal<MechanicStats>({
    total: 0, available: 0, unavailable: 0, top_specialty: '-', top_specialty_count: 0,
  });
  readonly loading = signal(true);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly perPage = 10;
  readonly workshops = signal<Workshop[]>([]);

  // ── Modal state ──
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly editTarget = signal<Mechanic | null>(null);
  readonly creating = signal(false);

  // ── Form model ──
  readonly newMechanic = signal<MechanicCreate>({
    full_name: '',
    phone: '',
    specialty: 'general',
    expertise: 'JUNIOR',
    avatar_color: '#091426',
    workshop_id: null,
  });

  // ── Edit form ──
  readonly editForm = signal<MechanicUpdate>({});

  // ── Options ──
  readonly specialtyOptions = SPECIALTY_OPTIONS;
  readonly expertiseOptions = EXPERTISE_OPTIONS;
  readonly avatarColors = AVATAR_COLORS;

  readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor(
    private mecService: MechanicService,
    private workshopService: WorkshopService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStaff();
    this.loadStats();
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.workshopService.list(1, 50).subscribe({
      next: (res) => this.workshops.set(res.items),
      error: () => this.notify.error('Error al cargar talleres')
    });
  }

  // ── Data loading ──

  loadStaff(): void {
    this.loading.set(true);
    this.mecService.list(this.currentPage(), this.perPage).subscribe({
      next: (res) => {
        this.staff.set(res.items);
        this.totalPages.set(res.pages);
        this.totalItems.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar personal');
        this.loading.set(false);
      },
    });
  }

  loadStats(): void {
    this.mecService.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {},
    });
  }

  // ── Pagination ──

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadStaff();
  }

  // ── Create ──

  openCreateModal(): void {
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    this.newMechanic.set({
      full_name: '',
      phone: '',
      specialty: 'general',
      expertise: 'JUNIOR',
      avatar_color: randomColor,
      workshop_id: this.workshops()[0]?.id ?? null,
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  onCreateSubmit(): void {
    const data = this.newMechanic();
    if (!data.full_name) {
      this.notify.error('El nombre es obligatorio');
      return;
    }
    this.creating.set(true);
    this.mecService.create(data).subscribe({
      next: () => {
        this.notify.success('Mecánico registrado exitosamente');
        this.closeCreateModal();
        this.creating.set(false);
        this.loadStaff();
        this.loadStats();
      },
      error: () => {
        this.notify.error('Error al registrar mecánico');
        this.creating.set(false);
      },
    });
  }

  updateCreateField(field: keyof MechanicCreate, value: any): void {
    this.newMechanic.update(current => ({ ...current, [field]: value }));
  }

  // ── Edit ──

  openEditModal(mec: Mechanic): void {
    this.editTarget.set(mec);
    this.editForm.set({
      full_name: mec.full_name,
      phone: mec.phone,
      specialty: mec.specialty,
      expertise: mec.expertise,
      avatar_color: mec.avatar_color,
      workshop_id: mec.workshop_id,
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editTarget.set(null);
  }

  updateEditField(field: string, value: any): void {
    this.editForm.update(current => ({ ...current, [field]: value }));
  }

  onEditSubmit(): void {
    const target = this.editTarget();
    if (!target) return;

    this.mecService.update(target.id, this.editForm()).subscribe({
      next: () => {
        this.notify.success(`${target.full_name} actualizado`);
        this.closeEditModal();
        this.loadStaff();
        this.loadStats();
      },
      error: () => this.notify.error('Error al actualizar mecánico'),
    });
  }

  // ── Toggle availability ──

  onToggleAvailability(mec: Mechanic): void {
    const newStatus = !mec.is_available;
    this.mecService.update(mec.id, { is_available: newStatus }).subscribe({
      next: () => {
        const label = newStatus ? 'Disponible' : 'No disponible';
        this.notify.success(`${mec.full_name} → ${label}`);
        this.loadStaff();
        this.loadStats();
      },
      error: () => this.notify.error('Error al cambiar disponibilidad'),
    });
  }

  // ── Delete ──

  onDelete(mec: Mechanic): void {
    if (!confirm(`¿Eliminar al mecánico ${mec.full_name}? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.mecService.delete(mec.id).subscribe({
      next: () => {
        this.notify.success(`${mec.full_name} eliminado del directorio`);
        this.loadStaff();
        this.loadStats();
      },
      error: () => this.notify.error('Error al eliminar mecánico'),
    });
  }
}
