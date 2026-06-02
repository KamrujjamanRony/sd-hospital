import { Component, inject, Input, Output, EventEmitter, OnInit, signal, computed, effect } from '@angular/core';
import { form, required, minLength, pattern, min, FormField } from '@angular/forms/signals';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { AuthService } from '../../../../../services/serial/auth.service';
import { AlertService } from '../../../../../services/alert.service';

interface EditDoctorModel {
  companyID: number | string;
  drSerial: string;
  drName: string;
  degree: string;
  designation: string;
  imageUrl: string;
  specialty: string;
  departmentId: string;
  phone: string;
  fee: number | string;
  visitTime: string;
  room: string;
  description: string;
  additional: string;
  notice: string;
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
  selector: 'app-edit-doctor-modal',
  standalone: true,
  imports: [FormField],
  templateUrl: './edit-doctor-modal.component.html',
  styleUrl: './edit-doctor-modal.component.css'
})
export class EditDoctorModalComponent implements OnInit {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  authService = inject(AuthService);
  alert = inject(AlertService);

  user = signal<any>(null);
  isSubmitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  selectedDoctor = computed(() => {
    const doctors = this.store.doctors();
    const idVal = typeof this.id === 'function' ? this.id() : this.id;
    return doctors.find((doctor) => doctor.id === idVal);
  });

  model = signal<EditDoctorModel>({
    companyID: environment.hospitalCode,
    drSerial: '',
    drName: '',
    degree: '',
    designation: '',
    imageUrl: '',
    specialty: '',
    departmentId: '',
    phone: '',
    fee: 0,
    visitTime: '',
    room: '',
    description: '',
    additional: '',
    notice: '',
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

  doctorForm = form<EditDoctorModel>(this.model, (p) => {
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

  constructor() {
    effect(() => {
      const d = this.selectedDoctor();
      if (d) {
        this.model.set({
          companyID: d.companyID ?? environment.hospitalCode,
          drSerial: (d.drSerial ?? '').toString(),
          drName: d.drName ?? '',
          degree: d.degree ?? '',
          designation: d.designation ?? '',
          imageUrl: d.imageUrl ?? '',
          specialty: d.specialty ?? '',
          departmentId: d.departmentId ?? '',
          phone: d.phone ?? '',
          fee: d.fee ?? 0,
          visitTime: d.visitTime ?? '',
          room: d.room ?? '',
          description: d.description ?? '',
          additional: d.additional ?? '',
          notice: d.notice ?? '',
          serialBlock: d.serialBlock ?? '',
          satNewPatientLimit: d.satNewPatientLimit ?? 0,
          satOldPatientLimit: d.satOldPatientLimit ?? 0,
          sunNewPatientLimit: d.sunNewPatientLimit ?? 0,
          sunOldPatientLimit: d.sunOldPatientLimit ?? 0,
          monNewPatientLimit: d.monNewPatientLimit ?? 0,
          monOldPatientLimit: d.monOldPatientLimit ?? 0,
          tueNewPatientLimit: d.tueNewPatientLimit ?? 0,
          tueOldPatientLimit: d.tueOldPatientLimit ?? 0,
          wedNewPatientLimit: d.wedNewPatientLimit ?? 0,
          wedOldPatientLimit: d.wedOldPatientLimit ?? 0,
          thuNewPatientLimit: d.thuNewPatientLimit ?? 0,
          thuOldPatientLimit: d.thuOldPatientLimit ?? 0,
          friNewPatientLimit: d.friNewPatientLimit ?? 0,
          friOldPatientLimit: d.friOldPatientLimit ?? 0
        });
      }
    });
  }

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
      this.doctorForm.drName(),
      this.doctorForm.departmentId(),
      this.doctorForm.phone()
    ].forEach((f) => f.errors().forEach((e) => msgs.push(e.message || e.kind)));
    return msgs;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitted.set(true);

    if (!this.doctorForm().valid()) {
      this.alert.validationWarning(this.collectErrorMessages());
      return;
    }

    this.isSubmitting.set(true);
    const formData = new FormData();
    const formValue = this.doctorForm().value();

    Object.keys(formValue).forEach((key) => {
      const value = (formValue as any)[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const idVal = typeof this.id === 'function' ? this.id() : this.id;
    try {
      this.store.updateDoctor({ id: idVal, data: formData });
      this.alert.success('Doctor updated', `Dr. ${formValue.drName} has been updated.`);
      this.closeThisModal();
    } catch (err: any) {
      this.alert.error('Failed to update doctor', err?.message || 'Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
