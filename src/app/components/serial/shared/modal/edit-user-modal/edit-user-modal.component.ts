import { Component, inject, Input, Output, EventEmitter, OnInit, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { form, validate, disabled } from '@angular/forms/signals';
import { AppStore } from '../../../../../store/app.store';
import { DataService } from '../../../../../services/serial/data.service';
import { AlertService } from '../../../../../services/alert.service';

interface EditUserModel {
  username: string;
  role: string[];
}

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [],
  templateUrl: './edit-user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  dataService = inject(DataService);
  alert = inject(AlertService);

  userRole = signal<any[]>([]);
  isSubmitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage: string | null = null;

  selectedUser = computed(() => {
    const users = this.store.users();
    return users.find((user) => user.userId == this.id);
  });

  model = signal<EditUserModel>({
    username: '',
    role: []
  });

  userForm = form<EditUserModel>(this.model, (p) => {
    disabled(p.username, () => true);
    validate(p.role, (ctx) => {
      const value = ctx.value();
      if (!value || !Array.isArray(value) || value.length === 0) {
        return { kind: 'required', message: 'At least one role is required' };
      }
      return null;
    });
  });

  constructor() {
    effect(() => {
      const user = this.selectedUser();
      if (user) {
        this.model.set({
          username: user.userName ?? '',
          role: user.roleIds ?? []
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.dataService.getJsonData().subscribe({
      next: (data) => {
        this.userRole.set(data.role || []);
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.errorMessage = 'Failed to load roles. Please try again.';
      }
    });
  }

  isRoleSelected(roleId: string): boolean {
    return this.model().role.includes(roleId);
  }

  onRoleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const values = Array.from(select.selectedOptions).map((o) => o.value);
    this.model.update((m) => ({ ...m, role: values }));
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitted.set(true);
    this.errorMessage = null;

    if (!this.userForm().valid() || !this.id) {
      const msgs = this.userForm.role().errors().map((e) => e.message || e.kind);
      this.alert.validationWarning(msgs);
      return;
    }

    this.isSubmitting.set(true);
    this.isLoading.set(true);
    const roles = this.model().role;
    try {
      this.store.updateUser({ id: this.id, data: roles });
      this.alert.success('User updated', 'Roles have been saved.');
      this.closeThisModal();
    } catch (err: any) {
      this.alert.error('Failed to update user', err?.message || 'Please try again.');
    } finally {
      this.isSubmitting.set(false);
      this.isLoading.set(false);
    }
  }

  closeThisModal(): void {
    this.closeModal.emit();
  }
}
