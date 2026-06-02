import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, Output, EventEmitter, OnInit, signal, computed, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { isBefore } from 'date-fns';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { ToastService } from '../../../../../services/serial/toast.service';
import { AuthService } from '../../../../../services/serial/auth.service';

@Component({
  selector: 'app-appointment-modal-serial',
  templateUrl: './appointment-modal-serial.component.html',
  styleUrls: ['./appointment-modal-serial.component.css'],
  providers: [DatePipe],
  imports: [ReactiveFormsModule, CommonModule]
})
export class AppointmentModalSerialComponent {
  datePipe = inject(DatePipe);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  store = inject(AppStore);

  @Input() id: any = signal(null);
  @Input() doctor: any = signal(null);
  @Output() closeAppointment = new EventEmitter<void>();

  user = signal<any>(null);
  blockSerials: string[] = [];

  // Computed signal to determine if we're editing or creating
  isEditMode = computed(() => {
    return !!this.id() && !!this.selectedAppointment();
  });

  // Get the selected appointment from store using computed
  selectedAppointment = computed(() => {
    const appointments = this.store.appointments();
    const appointment = appointments.find(apt => apt.id == this.id());
    console.log('Looking for appointment with ID:', this.id(), 'Found:', appointment);
    return appointment;
  });

  // Computed signals for departments and doctors
  departments = computed(() => {
    const depts = this.store.departments();
    console.log('Departments available:', depts);
    return depts;
  });

  doctorList = computed(() => {
    const departmentId = this.appointmentForm.get('departmentId')?.value;
    console.log('Current department ID for doctor list:', departmentId);

    if (departmentId) {
      const doctors = this.store.doctors().filter(d => d.departmentId == departmentId);
      console.log('Filtered doctors for department:', doctors);
      return doctors;
    }
    console.log('No department selected, returning empty doctor list');
    return [];
  });

  // Generate dates for the next 15 days
  dates: Date[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.updateFormValues();
    this.initializeForm();
  }

  initializeForm(): void {
    // If we have a doctor object (from Doctor Card), pre-fill the form for new appointment
    if (this.doctor && !this.isEditMode()) {
      console.log('Initializing form with doctor data for new appointment:', this.doctor);

      this.blockSerials = this.doctor?.serialBlock?.split(',') || [];

      // Pre-fill the form with doctor data
      this.appointmentForm.patchValue({
        departmentId: this.doctor.departmentId || '',
        drCode: this.doctor.id || '',
        fee: this.doctor.fee || 0,
        username: this.user()?.username || ''
      });

      console.log('Form after doctor pre-fill:', this.appointmentForm.value);
    }

    // If we're in edit mode, load the existing appointment data
    if (this.isEditMode()) {
      this.updateFormValues();
    }
  }

  onDepartmentChange(): void {
    const departmentId = this.appointmentForm.get('departmentId')?.value;
    console.log('Department changed to:', departmentId);

    if (departmentId) {
      // Reset doctor selection when department changes
      this.appointmentForm.patchValue({
        drCode: '',
        fee: 0
      });
    }
  }

  onDoctorChange(): void {
    const doctorId = this.appointmentForm.get('drCode')?.value;
    console.log('Doctor changed to:', doctorId);

    if (doctorId) {
      const doctor = this.store.doctors().find(d => d.id == doctorId);
      console.log('Found doctor:', doctor);

      if (doctor) {
        this.blockSerials = doctor?.serialBlock?.split(',') || [];
        console.log('Block serials:', this.blockSerials);

        this.appointmentForm.patchValue({
          departmentId: doctor.departmentId,
          fee: doctor.fee
        });
      }
    }
  }

  checkRoles(roleId: string): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  appointmentForm = this.fb.group({
    companyID: [environment.hospitalCode],
    pName: ['', Validators.required],
    age: [''],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{11,14}$/)]],
    sex: [''],
    type: ['true'],
    date: ['', Validators.required],
    sL: [''],
    departmentId: [this.doctor.departmentId || '', Validators.required],
    drCode: [this.doctor.departmentId || '', Validators.required],
    fee: [this.doctor.fee || 0],
    remarks: [''],
    username: [this.user()?.username || ''],
    paymentStatus: [false],
    confirmed: [false],
  });

  updateFormValues(): void {
    const appointment = this.selectedAppointment();
    console.log('Updating form values with appointment:', appointment);

    if (appointment) {
      const formattedDate = this.datePipe.transform(appointment.date, 'yyyy-MM-dd');
      console.log('Formatted date:', formattedDate);

      this.appointmentForm.patchValue({
        pName: appointment.pName || '',
        age: appointment.age || '',
        sex: appointment.sex || '',
        mobile: appointment.mobile || '',
        type: appointment.type?.toString() || 'true',
        date: formattedDate || '',
        sL: appointment.sl || '',
        departmentId: appointment.departmentId || '',
        username: appointment.username || this.user()?.username || '',
        drCode: appointment.drCode || '',
        fee: appointment.fee || 0,
        remarks: appointment.remarks || '',
        paymentStatus: appointment.paymentStatus || false,
        confirmed: appointment.confirmed || false,
      });
    } else {
      console.log('No appointment found for update - this is likely a new appointment');
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      console.log('Form is invalid, errors:', this.appointmentForm.errors);
      return;
    }

    const formData = new FormData();
    const formValue = this.appointmentForm.value;

    Object.keys(formValue).forEach(key => {
      const value = formValue[key as keyof typeof formValue];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
        // console.log(`Appended to FormData: ${key} = ${value}`);
      }
    });

    if (this.isEditMode()) {
      // Use store to update appointment - automatically updates global state
      this.store.updateAppointment({ id: this.id(), data: formData });
      this.updateFormValues();
    } else {
      // If we have a doctor object (from Doctor Card), pre-fill the form for new appointment
      if (this.doctor) {
        // Use store to add appointment - automatically updates global state
        this.store.addAppointment(formData);
      }
    }
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  }

  formReset(): void {
    this.appointmentForm.reset({
      companyID: environment.hospitalCode,
      pName: '',
      age: '',
      mobile: '',
      sex: '',
      type: 'true',
      date: '',
      sL: '',
      departmentId: this.doctor.departmentId || '',
      drCode: this.doctor.id || '',
      fee: this.doctor.fee || 0,
      remarks: '',
      username: this.user()?.username || '',
      paymentStatus: false,
      confirmed: false,
    });
  }
}