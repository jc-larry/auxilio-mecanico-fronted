import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterRequest, User } from '../../../../core/models/auth.models';
import { UserUpdate } from '../../../../core/models/user.models';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
})
export class UsersManagementComponent implements OnInit {
  // ── State ──
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly perPage = 10;
  
  readonly currentUser = computed(() => this.authService.currentUser());

  // ── Modal state ──
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showPasswordModal = signal(false);
  readonly editTarget = signal<User | null>(null);
  readonly creating = signal(false);
  readonly updatingPassword = signal(false);

  // ── Form model ──
  readonly newUser = signal<RegisterRequest>({
    full_name: '',

    email: '',
    password: '',
    confirm_password: '',
  });

  readonly passwordForm = signal({
    new_password: '',
    confirm_password: '',
  });

  // ── Edit form ──
  readonly editForm = signal<{ full_name: string; is_active: boolean; roles: string[] }>({
    full_name: '',
    is_active: true,
    roles: [],
  });
  
  readonly availableRoles = ['Administrador', 'Propietario', 'Mecánico', 'Cliente'];

  readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ── Data loading ──

  loadUsers(): void {
    this.loading.set(true);
    this.userService.list(this.currentPage(), this.perPage).subscribe({
      next: (res) => {
        this.users.set(res.items);
        this.totalPages.set(res.pages);
        this.totalItems.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar usuarios');
        this.loading.set(false);
      },
    });
  }

  // ── Pagination ──

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadUsers();
  }

  // ── Create ──

  openCreateModal(): void {
    this.newUser.set({
      full_name: '',

      email: '',
      password: '',
      confirm_password: '',
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  onCreateSubmit(): void {
    const data = this.newUser();
    if (!data.full_name || !data.email || !data.password) {
      this.notify.error('Todos los campos son obligatorios');
      return;
    }
    if (data.password !== data.confirm_password) {
      this.notify.error('Las contraseñas no coinciden');
      return;
    }
    this.creating.set(true);
    this.userService.create(data).subscribe({
      next: () => {
        this.notify.success('Usuario registrado exitosamente');
        this.closeCreateModal();
        this.creating.set(false);
        this.loadUsers();
      },
      error: (err) => {
        const message = err.error?.detail || 'Error al registrar usuario';
        this.notify.error(message);
        this.creating.set(false);
      },
    });
  }

  updateCreateField(field: keyof RegisterRequest, value: string): void {
    this.newUser.update(current => ({ ...current, [field]: value }));
  }

  // ── Edit ──

  openEditModal(user: User): void {
    this.editTarget.set(user);
    this.editForm.set({
      full_name: user.full_name,
      is_active: user.is_active,
      roles: user.roles ? [...user.roles] : [],
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
  
  toggleRoleSelection(role: string): void {
    const currentRoles = this.editForm().roles;
    if (currentRoles.includes(role)) {
      this.updateEditField('roles', currentRoles.filter(r => r !== role));
    } else {
      this.updateEditField('roles', [...currentRoles, role]);
    }
  }

  onEditSubmit(): void {
    const target = this.editTarget();
    if (!target) return;

    const payload: UserUpdate = {
      full_name: this.editForm().full_name,
      is_active: this.editForm().is_active,
      roles: this.editForm().roles,
    };

    this.userService.update(target.id, payload).subscribe({
      next: () => {
        this.notify.success(`${target.full_name} actualizado`);
        this.closeEditModal();
        this.loadUsers();
      },
      error: () => this.notify.error('Error al actualizar usuario'),
    });
  }

  // ── Password ──

  openPasswordModal(user: User): void {
    this.editTarget.set(user);
    this.passwordForm.set({ new_password: '', confirm_password: '' });
    this.showPasswordModal.set(true);
  }

  closePasswordModal(): void {
    this.showPasswordModal.set(false);
    this.editTarget.set(null);
  }

  updatePasswordField(field: 'new_password' | 'confirm_password', value: string): void {
    this.passwordForm.update(current => ({ ...current, [field]: value }));
  }

  onPasswordSubmit(): void {
    const target = this.editTarget();
    if (!target) return;

    const { new_password, confirm_password } = this.passwordForm();
    if (!new_password || new_password.length < 8) {
      this.notify.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (new_password !== confirm_password) {
      this.notify.error('Las contraseñas no coinciden');
      return;
    }

    this.updatingPassword.set(true);
    this.userService.updatePassword(target.id, new_password).subscribe({
      next: () => {
        this.notify.success(`Contraseña de ${target.full_name} actualizada`);
        this.closePasswordModal();
        this.updatingPassword.set(false);
      },
      error: (err) => {
        const message = err.error?.detail || 'Error al actualizar contraseña';
        this.notify.error(message);
        this.updatingPassword.set(false);
      },
    });
  }

  // ── Delete ──

  onDelete(user: User): void {
    if (user.id === this.currentUser()?.id) {
      this.notify.error('No puedes eliminarte a ti mismo');
      return;
    }
    if (!confirm(`¿Desactivar al usuario ${user.full_name}?`)) {
      return;
    }
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.notify.success(`${user.full_name} ha sido desactivado`);
        this.loadUsers();
      },
      error: () => this.notify.error('Error al eliminar usuario'),
    });
  }
}
