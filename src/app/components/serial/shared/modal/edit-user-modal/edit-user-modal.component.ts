import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../../../services/serial/users.service';
import { DataService } from '../../../../../services/serial/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {
  @Input() user: any;
  @Output() closeModal = new EventEmitter<void>();

  usersService = inject(UsersService);
  dataService = inject(DataService);
  fb = inject(FormBuilder);

  private subscriptions: Subscription[] = [];
  userRole = signal<any[]>([]);
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage: string | null = null;

  userForm = this.fb.group({
    username: new FormControl({ value: '', disabled: true }),
    role: new FormControl([] as string[], Validators.required)
  });

  ngOnInit(): void {
    this.loadRoles();
    this.updateFormValues();
  }

  loadRoles(): void {
    this.subscriptions.push(
      this.dataService.getJsonData().subscribe({
        next: (data) => {
          this.userRole.set(data.role || []);
        },
        error: (error) => {
          console.error('Error loading roles:', error);
          this.errorMessage = 'Failed to load roles. Please try again.';
        }
      })
    );
  }

  updateFormValues(): void {
    if (this.user()) {
      this.userForm.patchValue({
        username: this.user.userName,
        role: this.user.roleIds || []
      });
    }
  }

  onSubmit(): void {
    this.isSubmitted.set(true);
    this.errorMessage = null;

    if (this.userForm.invalid || !this.user?.userId) {
      return;
    }

    this.isLoading.set(true);
    const roles = this.userForm.value.role || [];

    this.subscriptions.push(
      this.usersService.updateUser(this.user.userId, roles).subscribe({
        next: () => {
          this.closeThisModal();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Failed to update user. Please try again.';
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      })
    );
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}