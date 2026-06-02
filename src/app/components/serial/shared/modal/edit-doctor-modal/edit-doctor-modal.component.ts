import { Component, inject, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environments';

import { AppStore } from '../../../../../store/app.store';
import { AuthService } from '../../../../../services/serial/auth.service';

@Component({
  selector: 'app-edit-doctor-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-doctor-modal.component.html',
  styleUrl: './edit-doctor-modal.component.css'
})
export class EditDoctorModalComponent implements OnInit {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  user = signal<any>(null);
  isSubmitted = signal<boolean>(false);

  // Get the selected doctor from store using computed
  selectedDoctor = computed(() => {
    const doctors = this.store.doctors();
    return doctors.find(doctor => doctor.id === this.id());
  });

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.updateFormValues();
  }

  checkRoles(roleId: any): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  closeThisModal(): void {
    this.closeModal.emit();
  }

  doctorForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    drSerial: [0],
    drName: ['', Validators.required],
    degree: [''],
    designation: [''],
    imageUrl: [''],
    specialty: [''],
    departmentId: ['', Validators.required],
    phone: [''],
    fee: [0],
    visitTime: [''],
    room: [''],
    description: [''],
    additional: [''],
    notice: [''],
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

  updateFormValues(): void {
    const doctor = this.selectedDoctor();
    if (doctor) {
      this.doctorForm.patchValue({
        companyID: doctor?.companyID,
        drSerial: doctor?.drSerial,
        drName: doctor?.drName,
        degree: doctor?.degree,
        imageUrl: doctor?.imageUrl,
        designation: doctor?.designation,
        specialty: doctor?.specialty,
        departmentId: doctor?.departmentId,
        phone: doctor?.phone,
        fee: doctor?.fee || 0,
        visitTime: doctor?.visitTime,
        room: doctor?.room,
        description: doctor?.description,
        additional: doctor?.additional,
        notice: doctor?.notice,
        serialBlock: doctor?.serialBlock,
        satNewPatientLimit: doctor?.satNewPatientLimit,
        satOldPatientLimit: doctor?.satOldPatientLimit,
        sunNewPatientLimit: doctor?.sunNewPatientLimit,
        sunOldPatientLimit: doctor?.sunOldPatientLimit,
        monNewPatientLimit: doctor?.monNewPatientLimit,
        monOldPatientLimit: doctor?.monOldPatientLimit,
        tueNewPatientLimit: doctor?.tueNewPatientLimit,
        tueOldPatientLimit: doctor?.tueOldPatientLimit,
        wedNewPatientLimit: doctor?.wedNewPatientLimit,
        wedOldPatientLimit: doctor?.wedOldPatientLimit,
        thuNewPatientLimit: doctor?.thuNewPatientLimit,
        thuOldPatientLimit: doctor?.thuOldPatientLimit,
        friNewPatientLimit: doctor?.friNewPatientLimit,
        friOldPatientLimit: doctor?.friOldPatientLimit
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

    // Use store to update doctor - this automatically updates global state
    this.store.updateDoctor({ id: this.id(), data: formData });
    this.closeThisModal();
  }
}