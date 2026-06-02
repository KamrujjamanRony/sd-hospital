import { Component, inject, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environments';

import { AppStore } from '../../../../../store/app.store';
import { AuthService } from '../../../../../services/serial/auth.service';

@Component({
  selector: 'app-add-doctor-modal',
  standalone: true,
  templateUrl: './add-doctor-modal.component.html',
  styleUrl: './add-doctor-modal.component.css',
  imports: [ReactiveFormsModule, FormsModule]
})
export class AddDoctorModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  user = signal<any>(null);
  departments = signal<any[]>([]);
  isSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
  }

  checkRoles(roleId: any): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  closeThisModal(): void {
    this.closeModal.emit();
  }

  addDoctorForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    drSerial: [''],
    drName: ['', Validators.required],
    degree: [''],
    designation: [''],
    specialty: [''],
    departmentId: ['', Validators.required],
    phone: ['', Validators.maxLength(14)],
    fee: [''],
    visitTime: [''],
    room: [''],
    description: [''],
    additional: [''],
    notice: [''],
    imageUrl: [''],
    serialBlock: [''],
    satNewPatientLimit: [0],
    satOldPatientLimit: [0],
    sunNewPatientLimit: [0],
    sunOldPatientLimit: [0],
    monNewPatientLimit: [0],
    monOldPatientLimit: [0],
    tueNewPatientLimit: [0],
    tueOldPatientLimit: [0],
    wedNewPatientLimit: [0],
    wedOldPatientLimit: [0],
    thuNewPatientLimit: [0],
    thuOldPatientLimit: [0],
    friNewPatientLimit: [0],
    friOldPatientLimit: [0],
  });

  onSubmit(): void {
    if (this.addDoctorForm.invalid) {
      this.isSubmitted.set(true);
      return;
    }

    const formData = new FormData();
    const formValue = this.addDoctorForm.value;

    Object.keys(formValue).forEach(key => {
      const value = formValue[key as keyof typeof formValue];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // This automatically updates the global state
    this.store.addDoctor(formData);
    this.closeThisModal();
  }
}