import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, Output, EventEmitter, OnInit, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { form, required, pattern, FormField } from '@angular/forms/signals';
import { isBefore } from 'date-fns';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { ToastService } from '../../../../../services/serial/toast.service';
import { AuthService } from '../../../../../services/serial/auth.service';
import { AlertService } from '../../../../../services/alert.service';

interface AppointmentModel {
  companyID: number | string;
  pName: string;
  age: string;
  mobile: string;
  sex: string;
  type: string;
  date: string;
  sL: string;
  departmentId: string;
  drCode: string;
  fee: number | string;
  remarks: string;
  username: string;
  paymentStatus: boolean;
  confirmed: boolean;
}

@Component({
  selector: 'app-appointment-modal-serial',
  templateUrl: './appointment-modal-serial.component.html',
  styleUrls: ['./appointment-modal-serial.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, CommonModule]
})
export class AppointmentModalSerialComponent implements OnInit {
  datePipe = inject(DatePipe);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  store = inject(AppStore);
  alert = inject(AlertService);

  @Input() id: any = signal(null);
  @Input() doctor: any = signal(null);
  @Output() closeAppointment = new EventEmitter<void>();

  user = signal<any>(null);
  blockSerials: string[] = [];
  isSubmitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  pendingSubmit = signal<boolean>(false);

  isEditMode = computed(() => !!this.id() && !!this.selectedAppointment());

  selectedAppointment = computed(() => {
    const appointments = this.store.appointments();
    return appointments.find((apt) => apt.id == this.id());
  });

  departments = computed(() => this.store.departments());

  doctorList = computed(() => {
    const departmentId = this.model().departmentId;
    if (departmentId) {
      return this.store.doctors().filter((d) => d.departmentId == departmentId);
    }
    return [];
  });

  dates: Date[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  model = signal<AppointmentModel>({
    companyID: environment.hospitalCode,
    pName: '',
    age: '',
    mobile: '',
    sex: '',
    type: 'true',
    date: '',
    sL: '',
    departmentId: '',
    drCode: '',
    fee: 0,
    remarks: '',
    username: '',
    paymentStatus: false,
    confirmed: false
  });

  appointmentForm = form<AppointmentModel>(this.model, (p) => {
    required(p.pName, { message: 'Patient name is required' });
    required(p.mobile, { message: 'Mobile number is required' });
    pattern(p.mobile, /^\+?[0-9]{11,15}$/, { message: 'Mobile must be 11-15 digits' });
    required(p.date, { message: 'Appointment date is required' });
    required(p.departmentId, { message: 'Department is required' });
    required(p.drCode, { message: 'Doctor is required' });
  });

  constructor() {
    effect(() => {
      const appointment = this.selectedAppointment();
      if (appointment) {
        const formattedDate = this.datePipe.transform(appointment.date, 'yyyy-MM-dd') || '';
        this.model.update((m) => ({
          ...m,
          pName: appointment.pName || '',
          age: appointment.age || '',
          sex: appointment.sex || '',
          mobile: appointment.mobile || '',
          type: appointment.type?.toString() || 'true',
          date: formattedDate,
          ...((appointment.sl && !this.isEditMode()) && { sL: appointment.sl }), // Ensure sL is only set if it exists in the appointment
          departmentId: appointment.departmentId || '',
          username: appointment.username || this.user()?.username || '',
          drCode: appointment.drCode || '',
          fee: appointment.fee || 0,
          remarks: appointment.remarks || '',
          paymentStatus: appointment.paymentStatus || false,
          confirmed: appointment.confirmed || false
        }));
      }
    });

    effect(() => {
      const loading = this.store.loading();
      if (this.pendingSubmit() && !loading) {
        this.pendingSubmit.set(false);
        this.isSubmitting.set(false);
        const error = this.store.error();
        if (error) {
          this.alert.error('Failed to save appointment', error);
        } else {
          this.closeAppointmentModal();
        }
      }
    });
  }

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.initializeForm();
  }

  initializeForm(): void {
    if (this.doctor && !this.isEditMode()) {
      this.blockSerials = this.doctor?.serialBlock?.split(',') || [];
      this.model.update((m) => ({
        ...m,
        departmentId: this.doctor.departmentId || '',
        drCode: this.doctor.id || '',
        fee: this.doctor.fee || 0,
        username: this.user()?.username || ''
      }));
    }
  }

  onDepartmentChange(): void {
    this.model.update((m) => ({ ...m, drCode: '', fee: 0 }));
  }

  onDoctorChange(): void {
    const doctorId = this.model().drCode;
    if (doctorId) {
      const doctor = this.store.doctors().find((d) => d.id == doctorId);
      if (doctor) {
        this.blockSerials = doctor?.serialBlock?.split(',') || [];
        this.model.update((m) => ({
          ...m,
          departmentId: doctor.departmentId,
          fee: doctor.fee ?? 0
        }));
      }
    }
  }

  checkRoles(roleId: string): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitted.set(true);

    if (!this.appointmentForm().valid()) {
      const msgs: string[] = [];
      [
        this.appointmentForm.pName(),
        this.appointmentForm.mobile(),
        this.appointmentForm.date(),
        this.appointmentForm.departmentId(),
        this.appointmentForm.drCode()
      ].forEach((f) => f.errors().forEach((e) => msgs.push(e.message || e.kind)));
      this.alert.validationWarning(msgs);
      return;
    }

    this.isSubmitting.set(true);
    const formData = new FormData();
    const formValue = this.appointmentForm().value();

    Object.keys(formValue).forEach((key) => {
      const value = (formValue as any)[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (this.isEditMode()) {
      this.store.updateAppointment({ id: this.id(), data: formData });
    } else if (this.doctor) {
      this.store.addAppointment(formData);
    }
    this.pendingSubmit.set(true);
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  }

  formReset(): void {
    this.model.set({
      companyID: environment.hospitalCode,
      pName: '',
      age: '',
      mobile: '',
      sex: '',
      type: 'true',
      date: '',
      sL: '',
      departmentId: this.doctor?.departmentId || '',
      drCode: this.doctor?.id || '',
      fee: this.doctor?.fee || 0,
      remarks: '',
      username: this.user()?.username || '',
      paymentStatus: false,
      confirmed: false
    });
    this.isSubmitted.set(false);
  }
}
