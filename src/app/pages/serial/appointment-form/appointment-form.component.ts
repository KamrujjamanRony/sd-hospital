import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format, isBefore } from 'date-fns';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../components/serial/shared/modal/confirm-modal/confirm-modal.component';
import { ToastService } from '../../../services/serial/toast.service';
import { AppointmentService } from '../../../services/serial/appointment.service';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { AuthService } from '../../../services/serial/auth.service';
import { environment } from '../../../../environments/environments';
import { DepartmentService } from '../../../services/serial/department.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css',
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent, FormsModule]
})
export class AppointmentFormComponent implements OnInit {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  authService = inject(AuthService);
  doctorList = signal<any>([]);
  departmentList = signal<any>([]);
  format = format;
  isSubmitted = signal<boolean>(false);
  selected = signal<any>(null);
  user = signal<any>(null);
  blockSerials = signal<any>(null);
  msg = signal<any>(null);
  confirm = signal<any>(null);
  confirmModal = signal<boolean>(false);
  private subscriptions: Subscription[] = [];

  readonly closeAppointment = output<void>();

  // Add this to your component class
  originalDoctorList = signal<any>([]);

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.getConfirm();
    this.loadInitialData();
    this.updateFormGroup();
  }

  loadInitialData() {
    forkJoin([
      this.doctorsService.getDoctors(),
      this.departmentService.getDepartments()
    ]).subscribe({
      next: ([doctors, departments]) => {
        this.originalDoctorList.set(doctors); // Store the original list
        this.doctorList.set(doctors); // Initialize filtered list
        this.departmentList.set(departments);
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
      }
    });
  }

  onDepartmentChange() {
    const departmentId = this.appointmentForm.value.departmentId;

    if (departmentId) {
      // Always filter from the original list
      this.doctorList = this.originalDoctorList().filter((d: any) => d.departmentId == departmentId);

      // Reset doctor selection when department changes
      this.appointmentForm.patchValue({
        drCode: '',
        fee: ''
      });
      this.selected.set(null);
    } else {
      // If no department selected, show all doctors
      this.doctorList.set([...this.originalDoctorList()]);
    }
  }

  onDoctorChange() {
    const doctorId = this.appointmentForm.value.drCode;
    if (doctorId) {
      // Find the selected doctor from the already loaded list
      this.selected.set(this.doctorList().find((d: any) => d.id === doctorId));

      if (this.selected()) {
        this.blockSerials = this.selected().serialBlock?.split(',');

        // Update department and fee
        this.appointmentForm.patchValue({
          departmentId: this.selected().departmentId,
          fee: this.selected().fee
        });
      }
    }
  }

  checkRoles(roleId: any) {
    return this.user()?.roleIds?.find((role: any) => role == roleId);
  }

  updateFormGroup(): void {
    this.appointmentForm.patchValue({
      confirmed: this.confirm()
    });
  }

  closeModal() {
    this.confirmModal.set(false);
    this.msg.set(null);
  }

  getConfirm() {
    this.confirm.set(false);
  }

  appointmentForm = this.fb.group({
    companyID: environment.hospitalCode,
    pName: ['', Validators.required],
    age: [''],
    sex: [''],
    mobile: ['', Validators.required],
    type: ["true"],
    date: ['', Validators.required],
    sL: "",
    departmentId: "",
    drCode: ['', Validators.required],
    fee: '',
    remarks: '',
    paymentStatus: false,
    confirmed: this.confirm(),
  });

  updateFormValues(): void {
    if (this.selected()) {
      this.appointmentForm.patchValue({
        departmentId: this.selected().departmentId,
        fee: this.selected().fee,
      });
    }
  }

  onSubmit(): void {
    this.isSubmitted.set(true);
    const { pName, age, sex, date, type, departmentId, sL, drCode, fee, remarks, paymentStatus, confirmed, mobile } = this.appointmentForm.value;

    if (drCode && pName && type && date) {
      const formData = new FormData();
      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('Date', date);
      formData.append('DepartmentId', departmentId != null ? departmentId.toString() : '');
      formData.append('SL', sL != null ? sL.toString() : '');
      formData.append('Type', type || '');
      formData.append('DrCode', drCode != null ? drCode.toString() : '');
      formData.append('PName', pName);
      formData.append('Age', age || '');
      formData.append('Sex', sex || '');
      formData.append('Mobile', mobile || '');
      formData.append('Fee', fee != null ? fee.toString() : '');
      formData.append('Username', this.user().username);
      formData.append('Remarks', remarks || '');
      formData.append('PaymentStatus', paymentStatus != null ? paymentStatus.toString() : '');
      formData.append('Confirmed', confirmed != null ? confirmed.toString() : this.confirm());

      this.subscriptions.push(
        this.appointmentService.addAppointment(formData).subscribe({
          next: () => {
            this.formReset();
            this.msg.set("Appointment is successfully added!");
            this.confirmModal.set(true);
          },
          error: (error) => {
            this.handleError(error);
            setTimeout(() => {
              this.closeAppointmentModal();
            }, 2000);
          }
        })
      );
      this.isSubmitted.set(false);
    } else {
      this.msg.set("Please fill all required fields!");
      this.isSubmitted.set(false);
    }
  }

  dates: Date[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

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
      fee: '',
      remarks: '',
      paymentStatus: false,
      confirmed: this.confirm()
    });
  }

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  private handleError(error: any) {
    this.msg.set(error?.error?.message || 'An error occurred');
    console.error(error);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}