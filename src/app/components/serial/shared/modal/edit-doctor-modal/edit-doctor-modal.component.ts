import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { ImgbbService } from '../../../../../services/serial/imgbb.service';
import { environment } from '../../../../../../environments/environments';
import { AuthService } from '../../../../../services/serial/auth.service';
import { DepartmentService } from '../../../../../services/serial/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-doctor-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-doctor-modal.component.html',
  styleUrl: './edit-doctor-modal.component.css'
})
export class EditDoctorModalComponent implements OnInit {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();

  doctorsService = inject(DoctorsService);
  departmentService = inject(DepartmentService);
  imgbbService = inject(ImgbbService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  private subscriptions: Subscription[] = [];
  user = signal<any>(null);
  selected = signal<any>(null);
  departments = signal<any[]>([]);
  isSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.loadDoctor();
    this.loadDepartments();
  }

  loadDoctor(): void {
    this.subscriptions.push(
      this.doctorsService.getDoctorById(this.id()).subscribe(doctor => {
        this.selected.set(doctor);
        this.updateFormValues();
      })
    );
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

  doctorForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    drSerial: [''],
    drName: ['', Validators.required],
    degree: [''],
    designation: [''],
    imageUrl: [''],
    specialty: [''],
    departmentId: ['', Validators.required],
    phone: [''],
    fee: [''],
    visitTime: [''],
    room: [''],
    description: [''],
    additional: [''],
    notice: [''],
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

  updateFormValues(): void {
    if (this.selected()) {
      this.doctorForm.patchValue({
        companyID: this.selected()?.companyID,
        drSerial: this.selected()?.drSerial,
        drName: this.selected()?.drName,
        degree: this.selected()?.degree,
        imageUrl: this.selected()?.imageUrl,
        designation: this.selected()?.designation,
        specialty: this.selected()?.specialty,
        departmentId: this.selected()?.departmentId,
        phone: this.selected()?.phone,
        fee: this.selected()?.fee || 0,
        visitTime: this.selected()?.visitTime,
        room: this.selected()?.room,
        description: this.selected()?.description,
        additional: this.selected()?.additional,
        notice: this.selected()?.notice,
        serialBlock: this.selected()?.serialBlock,
        satNewPatientLimit: this.selected()?.satNewPatientLimit,
        satOldPatientLimit: this.selected()?.satOldPatientLimit,
        sunNewPatientLimit: this.selected()?.sunNewPatientLimit,
        sunOldPatientLimit: this.selected()?.sunOldPatientLimit,
        monNewPatientLimit: this.selected()?.monNewPatientLimit,
        monOldPatientLimit: this.selected()?.monOldPatientLimit,
        tueNewPatientLimit: this.selected()?.tueNewPatientLimit,
        tueOldPatientLimit: this.selected()?.tueOldPatientLimit,
        wedNewPatientLimit: this.selected()?.wedNewPatientLimit,
        wedOldPatientLimit: this.selected()?.wedOldPatientLimit,
        thuNewPatientLimit: this.selected()?.thuNewPatientLimit,
        thuOldPatientLimit: this.selected()?.thuOldPatientLimit,
        friNewPatientLimit: this.selected()?.friNewPatientLimit,
        friOldPatientLimit: this.selected()?.friOldPatientLimit
      });
    }
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.isSubmitted.set(true);
      return;
    }

    const formData = new FormData();
    const formValue = this.doctorForm.value;

    Object.keys(formValue).forEach(key => {
      const value = formValue[key as keyof typeof formValue];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    this.subscriptions.push(
      this.doctorsService.updateDoctor(this.selected().id, formData).subscribe({
        next: () => {
          this.closeThisModal();
        },
        error: (error) => {
          console.error('Error updating doctor:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}