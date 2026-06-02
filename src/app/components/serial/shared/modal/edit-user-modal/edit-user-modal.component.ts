import { Component, inject, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppStore } from '../../../../../store/app.store';
import { DataService } from '../../../../../services/serial/data.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  dataService = inject(DataService);
  fb = inject(FormBuilder);

  userRole = signal<any[]>([]);
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage: string | null = null;

  selectedUser = computed(() => {
    const users = this.store.users();
    return users.find(user => user.userId == this.id);
  });

  userForm = this.fb.group({
    username: new FormControl({ value: '', disabled: true }),
    role: new FormControl([] as string[], Validators.required)
  });

  ngOnInit(): void {
    this.loadRoles();
    this.updateFormValues();
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

  updateFormValues(): void {
    const user = this.selectedUser();

    if (user) {
      this.userForm.patchValue({
        username: user.userName,
        role: user.roleIds || []
      });
    } else {
      console.error('User not found for userId:', this.id);
      this.errorMessage = 'User not found. Please try again.';
    }
  }

  onSubmit(): void {
    this.isSubmitted.set(true);
    this.errorMessage = null;

    if (this.userForm.invalid || !this.id) {
      return;
    }

    this.isLoading.set(true);
    const roles = this.userForm.value.role || [];

    console.log('Updating user with roles:', roles);
    console.log('User ID:', this.id);

    // Use store to update user - pass the roles array directly
    this.store.updateUser({ id: this.id, data: roles });
    this.closeThisModal();
  }

  showError(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control?.invalid && (control?.dirty || control?.touched || this.isSubmitted());
  }

  isRoleSelected(roleId: string): boolean {
    return this.userForm.value.role?.includes(roleId) || false;
  }

  closeThisModal(): void {
    this.closeModal.emit();
  }
}