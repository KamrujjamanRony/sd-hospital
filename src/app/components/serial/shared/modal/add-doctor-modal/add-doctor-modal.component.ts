import { Component, inject, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { environment } from '../../../../../../environments/environments';
import { AuthService } from '../../../../../services/serial/auth.service';
import { DepartmentService } from '../../../../../services/serial/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-doctor-modal',
  standalone: true,
  templateUrl: './add-doctor-modal.component.html',
  styleUrl: './add-doctor-modal.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddDoctorModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  doctorsService = inject(DoctorsService);
  departmentService = inject(DepartmentService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  private subscriptions: Subscription[] = [];
  user = signal<any>(null);
  departments = signal<any[]>([]);
  isSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe(departments => {
        this.departments.set(departments);
      })
    );
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
    satNewPatientLimit: [''],
    satOldPatientLimit: [''],
    sunNewPatientLimit: [''],
    sunOldPatientLimit: [''],
    monNewPatientLimit: [''],
    monOldPatientLimit: [''],
    tueNewPatientLimit: [''],
    tueOldPatientLimit: [''],
    wedNewPatientLimit: [''],
    wedOldPatientLimit: [''],
    thuNewPatientLimit: [''],
    thuOldPatientLimit: [''],
    friNewPatientLimit: [''],
    friOldPatientLimit: [''],
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

    this.subscriptions.push(
      this.doctorsService.addDoctor(formData).subscribe({
        next: () => {
          this.closeThisModal();
        },
        error: (error) => {
          console.error('Error adding doctor:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}