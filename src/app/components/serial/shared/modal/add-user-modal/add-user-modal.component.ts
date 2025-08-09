import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component";
import { UserAuthService } from '../../../../../services/serial/userAuth.service';
import { environment } from '../../../../../../environments/environments';
import { DataService } from '../../../../../services/serial/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css',
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent]
})
export class AddUserModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  userAuthService = inject(UserAuthService);
  dataService = inject(DataService);
  fb = inject(FormBuilder);
  private subscriptions: Subscription[] = [];
  isSubmitted = false;
  confirmModal = false;
  userRole: any[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.dataService.getJsonData().subscribe(data => {
        this.userRole = data.role;
      })
    );
  }

  closeThisModal(): void {
    this.closeModal.emit();
  }

  closeConfirmModal(): void {
    this.confirmModal = false;
    this.closeThisModal();
  }

  addUsersForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: [[], Validators.required],
  });

  onSubmit(): void {
    if (this.addUsersForm.invalid) {
      this.isSubmitted = true;
      return;
    }

    const { username, password, role } = this.addUsersForm.value;
    const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('Username', username || '');
    formData.append('Password', environment.userCode + password || '');
    (role as unknown as any[]).forEach(r => formData.append('Roles', r));

    this.subscriptions.push(
      this.userAuthService.registerUser(formData).subscribe({
        next: () => {
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error registering user:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}