import { Component, inject, Output, EventEmitter, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, required, minLength, validate, FormField } from '@angular/forms/signals';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { DataService } from '../../../../../services/serial/data.service';
import { AlertService } from '../../../../../services/alert.service';

interface AddUserModel {
  username: string;
  password: string;
  role: string[];
}

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField]
})
export class AddUserModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  dataService = inject(DataService);
  alert = inject(AlertService);

  isSubmitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  confirmModal = signal<boolean>(false);
  userRole = signal<any[]>([]);

  private model = signal<AddUserModel>({
    username: '',
    password: '',
    role: []
  });

  addUsersForm = form<AddUserModel>(this.model, (p) => {
    required(p.username, { message: 'Username is required' });
    minLength(p.username, 3, { message: 'Username must be at least 3 characters' });
    required(p.password, { message: 'Password is required' });
    minLength(p.password, 4, { message: 'Password must be at least 4 characters' });
    validate(p.role, (ctx) => {
      const value = ctx.value();
      if (!value || !Array.isArray(value) || value.length === 0) {
        return { kind: 'required', message: 'At least one role is required' };
      }
      return null;
    });
  });

  ngOnInit(): void {
    this.dataService.getJsonData().subscribe((data) => {
      this.userRole.set(data.role);
    });
  }

  closeThisModal(): void {
    this.closeModal.emit();
  }

  closeConfirmModal(): void {
    this.confirmModal.set(false);
    this.closeThisModal();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitted.set(true);

    if (!this.addUsersForm().valid()) {
      const msgs: string[] = [];
      [this.addUsersForm.username(), this.addUsersForm.password(), this.addUsersForm.role()].forEach((f) => {
        f.errors().forEach((e) => msgs.push(e.message || e.kind));
      });
      this.alert.validationWarning(msgs);
      return;
    }

    this.isSubmitting.set(true);
    const { username, password, role } = this.addUsersForm().value();
    const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('Username', username || '');
    formData.append('Password', environment.userCode + (password || ''));

    if (role && Array.isArray(role)) {
      role.forEach((r) => formData.append('Roles', r));
    }

    try {
      this.store.registerUser(formData);
      this.store.loadUsers();
      this.alert.success('User added', `"${username}" has been registered.`);
      this.confirmModal.set(true);
      this.closeModal.emit();
    } catch (err: any) {
      this.alert.error('Failed to add user', err?.message || 'Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onRoleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const values = Array.from(select.selectedOptions).map((o) => o.value);
    this.model.update((m) => ({ ...m, role: values }));
  }
}
