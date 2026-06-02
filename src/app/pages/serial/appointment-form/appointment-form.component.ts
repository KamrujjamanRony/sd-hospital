import { Component, inject, OnInit, output, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format, isBefore } from 'date-fns';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environments';
import { AppStore } from '../../../store/app.store';
import { ToastService } from '../../../services/serial/toast.service';
import { AuthService } from '../../../services/serial/auth.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AppointmentFormComponent {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  store = inject(AppStore);

  format = format;
  selectedDoctor = signal<any>(null);
  user = signal<any>(null);
  blockSerials = signal<any[]>([]);
  confirm = signal<any>(false);

  // Track selected department and doctor separately
  selectedDepartmentId = signal<string>('');
  selectedDoctorId = signal<string>('');

  readonly closeAppointment = output<void>();

  // Computed signals for departments and doctors
  departmentList = computed(() => this.store.departments());

  // Filtered doctors based on selected department
  filteredDoctors = computed(() => {
    const departmentId = this.selectedDepartmentId();

    if (departmentId) {
      const filtered = this.store.doctors().filter(doctor =>
        doctor.departmentId == departmentId
      );
      return filtered;
    }

    // If no department selected, return all doctors
    return this.store.doctors();
  });

  // Generate dates for the next 15 days
  dates: Date[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
  msg: any;

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.updateFormGroup();
  }

  onDepartmentChange(event: any): void {
    const departmentId = event.target.value;

    this.selectedDepartmentId.set(departmentId);

    if (departmentId) {
      // Reset doctor selection when department changes
      this.selectedDoctorId.set('');
      this.selectedDoctor.set(null);
      this.blockSerials.set([]);

      this.appointmentForm.patchValue({
        drCode: '',
        fee: 0
      });
    }
  }

  onDoctorChange(event: any): void {
    const doctorId = event.target.value;

    this.selectedDoctorId.set(doctorId);

    if (doctorId) {
      // Find the selected doctor
      const doctor = this.store.doctors().find(d => d.id == doctorId);
      this.selectedDoctor.set(doctor);

      if (doctor) {
        this.blockSerials.set(doctor.serialBlock?.split(',') || []);

        // Update department and fee in the form
        this.selectedDepartmentId.set(doctor.departmentId);

        this.appointmentForm.patchValue({
          departmentId: doctor.departmentId,
          fee: doctor.fee,
          drCode: doctorId
        });
      }
    } else {
      this.selectedDoctor.set(null);
      this.blockSerials.set([]);
    }
  }

  checkRoles(roleId: any): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  updateFormGroup(): void {
    this.appointmentForm.patchValue({
      confirmed: this.confirm()
    });
  }

  appointmentForm = this.fb.group({
    companyID: [environment.hospitalCode],
    pName: ['', Validators.required],
    age: [''],
    sex: [''],
    mobile: ['', Validators.required],
    type: ["true"],
    date: ['', Validators.required],
    sL: [""],
    departmentId: [""],
    drCode: ['', Validators.required],
    fee: [0],
    remarks: [''],
    paymentStatus: [false],
    confirmed: [this.confirm()],
  });


  onSubmit(): void {
    const formValue = this.appointmentForm.value;

    if (this.appointmentForm.valid) {
      const formData = new FormData();
      // Append all form data
      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('Date', formValue.date || '');
      formData.append('DepartmentId', formValue.departmentId || '');
      formData.append('SL', formValue.sL || '');
      formData.append('Type', formValue.type || '');
      formData.append('DrCode', formValue.drCode || '');
      formData.append('PName', formValue.pName || '');
      formData.append('Age', formValue.age || '');
      formData.append('Sex', formValue.sex || '');
      formData.append('Mobile', formValue.mobile || '');
      formData.append('Fee', (formValue.fee ?? 0).toString());
      formData.append('Username', this.user()?.username || '');
      formData.append('Remarks', formValue.remarks || '');
      formData.append('PaymentStatus', formValue.paymentStatus?.toString() || 'false');
      formData.append('Confirmed', formValue.confirmed?.toString() || 'false');

      // Use store to add appointment - automatically updates global state
      this.store.addAppointment(formData);

    } else {
      this.msg.set("Please fill all required fields!");
      console.log('Form validation errors:', this.appointmentForm.errors);
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
      sex: '',
      mobile: '',
      type: "true",
      date: '',
      sL: "",
      departmentId: "",
      drCode: '',
      fee: 0,
      remarks: '',
      paymentStatus: false,
      confirmed: this.confirm()
    });

    this.selectedDepartmentId.set('');
    this.selectedDoctorId.set('');
    this.selectedDoctor.set(null);
    this.blockSerials.set([]);
  }

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }
}
