import { Component, inject, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { form, required, minLength, pattern, min, FormField } from '@angular/forms/signals';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { AuthService } from '../../../../../services/serial/auth.service';
import { AlertService } from '../../../../../services/alert.service';

interface AddDoctorModel {
  companyID: number | string;
  drSerial: string;
  drName: string;
  degree: string;
  designation: string;
  specialty: string;
  departmentId: string;
  phone: string;
  fee: number | string;
  visitTime: string;
  room: string;
  description: string;
  additional: string;
  notice: string;
  imageUrl: string;
  serialBlock: string;
  satNewPatientLimit: number;
  satOldPatientLimit: number;
  sunNewPatientLimit: number;
  sunOldPatientLimit: number;
  monNewPatientLimit: number;
  monOldPatientLimit: number;
  tueNewPatientLimit: number;
  tueOldPatientLimit: number;
  wedNewPatientLimit: number;
  wedOldPatientLimit: number;
  thuNewPatientLimit: number;
  thuOldPatientLimit: number;
  friNewPatientLimit: number;
  friOldPatientLimit: number;
}

@Component({
  selector: 'app-add-doctor-modal',
  standalone: true,
  templateUrl: './add-doctor-modal.component.html',
  styleUrl: './add-doctor-modal.component.css',
  imports: [FormField]
})
export class AddDoctorModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  authService = inject(AuthService);
  alert = inject(AlertService);

  user = signal<any>(null);
  isSubmitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  model = signal<AddDoctorModel>({
    companyID: environment.hospitalCode,
    drSerial: '',
    drName: '',
    degree: '',
    designation: '',
    specialty: '',
    departmentId: '',
    phone: '',
    fee: '',
    visitTime: '',
    room: '',
    description: '',
    additional: '',
    notice: '',
    imageUrl: '',
    serialBlock: '',
    satNewPatientLimit: 0,
    satOldPatientLimit: 0,
    sunNewPatientLimit: 0,
    sunOldPatientLimit: 0,
    monNewPatientLimit: 0,
    monOldPatientLimit: 0,
    tueNewPatientLimit: 0,
    tueOldPatientLimit: 0,
    wedNewPatientLimit: 0,
    wedOldPatientLimit: 0,
    thuNewPatientLimit: 0,
    thuOldPatientLimit: 0,
    friNewPatientLimit: 0,
    friOldPatientLimit: 0
  });

  addDoctorForm = form<AddDoctorModel>(this.model, (p) => {
    required(p.drName, { message: 'Doctor name is required' });
    minLength(p.drName, 2, { message: 'Doctor name must be at least 2 characters' });
    required(p.departmentId, { message: 'Department is required' });
    pattern(p.phone, /^$|^[0-9+\-\s]{6,14}$/, { message: 'Phone must be 6-14 digits (optionally +, -, spaces)' });
    min(p.satNewPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.satOldPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.sunNewPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.sunOldPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.monNewPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.monOldPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.tueNewPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.tueOldPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.wedNewPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.wedOldPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.thuNewPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.thuOldPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.friNewPatientLimit, 0, { message: 'Limit cannot be negative' });
    min(p.friOldPatientLimit, 0, { message: 'Limit cannot be negative' });
  });

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
  }

  checkRoles(roleId: any): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  closeThisModal(): void {
    this.closeModal.emit();
  }

  private collectErrorMessages(): string[] {
    const msgs: string[] = [];
    [
      this.addDoctorForm.drName(),
      this.addDoctorForm.departmentId(),
      this.addDoctorForm.phone()
    ].forEach((f) => f.errors().forEach((e) => msgs.push(e.message || e.kind)));
    return msgs;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitted.set(true);

    if (!this.addDoctorForm().valid()) {
      this.alert.validationWarning(this.collectErrorMessages());
      return;
    }

    this.isSubmitting.set(true);
    const formData = new FormData();
    const formValue = this.addDoctorForm().value();

    Object.keys(formValue).forEach((key) => {
      const value = (formValue as any)[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    try {
      this.store.addDoctor(formData);
      this.alert.success('Doctor added', `Dr. ${formValue.drName} has been added.`);
      this.closeThisModal();
    } catch (err: any) {
      this.alert.error('Failed to add doctor', err?.message || 'Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
