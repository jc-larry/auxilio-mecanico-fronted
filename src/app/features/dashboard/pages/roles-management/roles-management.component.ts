import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role, RoleCreate, RoleUpdate, Permission } from '../../../../core/models/role.models';
import { RoleService } from '../../../../core/services/role.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-roles-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-management.component.html',
})
export class RolesManagementComponent implements OnInit {
  // ── State ──
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly perPage = 10;
  
  readonly availablePermissions = signal<Permission[]>([]);

  // ── Modal state ──
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly editTarget = signal<Role | null>(null);
  readonly processing = signal(false);

  // ── Form models ──
  readonly newRole = signal<RoleCreate>({
    nombre: '',
    permisos_ids: [],
  });

  readonly editForm = signal<RoleUpdate>({
    nombre: '',
    permisos_ids: [],
  });

  readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor(
    private roleService: RoleService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  // ── Data loading ──

  loadRoles(): void {
    this.loading.set(true);
    this.roleService.list(this.currentPage(), this.perPage).subscribe({
      next: (res) => {
        this.roles.set(res.items);
        this.totalPages.set(res.pages);
        this.totalItems.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar roles');
        this.loading.set(false);
      },
    });
  }

  loadPermissions(): void {
    this.roleService.listPermissions().subscribe({
      next: (res) => this.availablePermissions.set(res),
      error: () => this.notify.error('Error al cargar permisos'),
    });
  }

  // ── Pagination ──

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadRoles();
  }

  // ── Create ──

  openCreateModal(): void {
    this.newRole.set({
      nombre: '',
      permisos_ids: [],
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  togglePermissionInCreate(id: number): void {
    const current = this.newRole().permisos_ids;
    if (current.includes(id)) {
      this.newRole.update(v => ({ ...v, permisos_ids: current.filter(pid => pid !== id) }));
    } else {
      this.newRole.update(v => ({ ...v, permisos_ids: [...current, id] }));
    }
  }

  onCreateSubmit(): void {
    const data = this.newRole();
    if (!data.nombre) {
      this.notify.error('El nombre es obligatorio');
      return;
    }
    this.processing.set(true);
    this.roleService.create(data).subscribe({
      next: () => {
        this.notify.success('Rol creado exitosamente');
        this.closeCreateModal();
        this.processing.set(false);
        this.loadRoles();
      },
      error: () => {
        this.notify.error('Error al crear rol');
        this.processing.set(false);
      },
    });
  }

  // ── Edit ──

  openEditModal(role: Role): void {
    this.editTarget.set(role);
    this.editForm.set({
      nombre: role.nombre,
      permisos_ids: role.permisos.map(p => p.id),
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editTarget.set(null);
  }

  togglePermissionInEdit(id: number): void {
    const current = this.editForm().permisos_ids || [];
    if (current.includes(id)) {
      this.editForm.update(v => ({ ...v, permisos_ids: current.filter(pid => pid !== id) }));
    } else {
      this.editForm.update(v => ({ ...v, permisos_ids: [...current, id] }));
    }
  }

  onEditSubmit(): void {
    const target = this.editTarget();
    if (!target) return;

    this.processing.set(true);
    this.roleService.update(target.id, this.editForm()).subscribe({
      next: () => {
        this.notify.success(`Rol ${target.nombre} actualizado`);
        this.closeEditModal();
        this.processing.set(false);
        this.loadRoles();
      },
      error: () => {
        this.notify.error('Error al actualizar rol');
        this.processing.set(false);
      },
    });
  }

  // ── Delete ──

  onDelete(role: Role): void {
    if (!confirm(`¿Estás seguro de eliminar el rol ${role.nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.roleService.delete(role.id).subscribe({
      next: () => {
        this.notify.success(`Rol ${role.nombre} eliminado`);
        this.loadRoles();
      },
      error: () => this.notify.error('Error al eliminar rol. Asegúrate de que no esté en uso.'),
    });
  }
}
