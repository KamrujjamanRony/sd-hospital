import { Component, inject, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environments';

import { AppStore } from '../../../../../store/app.store';
import { DataService } from '../../../../../services/serial/data.service';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css',
  imports: [ReactiveFormsModule]
})
export class AddUserModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  dataService = inject(DataService);
  fb = inject(FormBuilder);

  isSubmitted = signal<boolean>(false);
  confirmModal = signal<boolean>(false);
  userRole = signal<any[]>([]);

  ngOnInit(): void {
    this.dataService.getJsonData().subscribe(data => {
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

  addUsersForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: [<string[]>[], Validators.required],
  });

  onSubmit(): void {
    if (this.addUsersForm.invalid) {
      this.isSubmitted.set(true);
      return;
    }

    const { username, password, role } = this.addUsersForm.value;
    const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('Username', username || '');
    formData.append('Password', environment.userCode + password || '');

    // Append each role individually
    if (role && Array.isArray(role)) {
      role.forEach(r => formData.append('Roles', r));
    }

    console.log('FormData being sent:');
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    // Use store to register user - automatically updates global state
    this.store.registerUser(formData);
    // Force refresh users from API
    this.store.loadUsers();
    this.confirmModal.set(true);
    this.closeModal.emit();
  }
}