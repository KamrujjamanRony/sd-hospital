import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { format, isBefore } from 'date-fns';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ToastService } from '../../../../../services/serial/toast.service';
import { AppointmentService } from '../../../../../services/serial/appointment.service';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { AuthService } from '../../../../../services/serial/auth.service';
import { DepartmentService } from '../../../../../services/serial/department.service';
import { AppointmentsService } from '../../../../../services/serial/appointments.service';
import { environment } from '../../../../../../environments/environments';

@Component({
  selector: 'app-appointment-modal-serial',
  standalone: true,
  templateUrl: './appointment-modal-serial.component.html',
  styleUrls: ['./appointment-modal-serial.component.css'],
  providers: [DatePipe],
  imports: [ReactiveFormsModule, ConfirmModalComponent, CommonModule]
})
export class AppointmentModalSerialComponent implements OnInit {
  datePipe = inject(DatePipe);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  appointmentService = inject(AppointmentService);
  appointmentsService = inject(AppointmentsService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  authService = inject(AuthService);

  @Input() doctor: any;
  @Input() id: any;
  @Output() closeAppointment = new EventEmitter<void>();

  user = signal<any>(null);
  blockSerials: string[] = [];
  msg: string | null = null;
  err: string | null = null;
  isSubmitted = signal<boolean>(false);
  selected = signal<any>(null);
  selectedDoctor = signal<any>(null);
  doctorList = signal<any[]>([]);
  departments = signal<any[]>([]);
  confirmModal = signal<boolean>(false);
  private subscriptions: Subscription[] = [];

  // Generate dates for the next 15 days
  dates: Date[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.fetchDepartments();
    if (this.id) {
      this.loadAppointment();
    }
    if (this.doctor) {
      this.blockSerials = this.doctor?.serialBlock?.split(',') || [];
      this.appointmentForm.patchValue({
        drCode: this.doctor.id,
        departmentId: this.doctor.departmentId,
        fee: this.doctor.fee
      });
      this.loadDoctorList(this.doctor.departmentId); // Pass departmentId here
    }
  }

  fetchDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe(departments => {
        this.departments.set(departments);
      })
    );
  }

  loadAppointment(): void {
    this.subscriptions.push(
      this.appointmentsService.getAppointmentDataById(this.id).subscribe({
        next: (data) => {
          this.selected.set(data);
          this.updateFormValues();
          this.loadDoctorList(data.departmentId); // Pass departmentId here
        },
        error: (error) => {
          console.error('Error loading appointment:', error);
          this.err = 'Failed to load appointment data';
        }
      })
    );
  }

  loadDoctorList(departmentId: string): void {
    if (departmentId) {
      this.subscriptions.push(
        this.doctorsService.getDoctors().subscribe({
          next: (doctors) => {
            this.doctorList.set(doctors.filter(d => d.departmentId === departmentId));
            // If editing an appointment, ensure the doctor is in the list
            if (this.selected()?.drCode && !this.doctorList().some(d => d.id === this.selected().drCode)) {
              this.doctorsService.getDoctorById(this.selected().drCode).subscribe(doctor => {
                this.doctorList().push(doctor);
              });
            }
          },
          error: (error) => {
            console.error('Error loading doctors:', error);
          }
        })
      );
    } else {
      this.doctorList.set([]);
    }
  }

  onDepartmentChange(): void {
    const departmentId = this.appointmentForm.value.departmentId;
    if (departmentId) {
      this.loadDoctorList(departmentId);
      // Reset doctor selection when department changes
      this.appointmentForm.patchValue({
        drCode: '',
        fee: ''
      });
    }
  }

  onDoctorChange(): void {
    const doctorId = this.appointmentForm.value.drCode;
    if (doctorId) {
      this.subscriptions.push(
        this.doctorsService.getDoctorById(doctorId).subscribe({
          next: (doctor) => {
            this.selectedDoctor = doctor;
            this.blockSerials = doctor?.serialBlock?.split(',') || [];
            this.appointmentForm.patchValue({
              departmentId: doctor.departmentId,
              fee: doctor.fee
            });
          },
          error: (error) => {
            console.error('Error loading doctor:', error);
          }
        })
      );
    }
  }

  checkRoles(roleId: string): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  closeModal(): void {
    this.confirmModal.set(false);
    this.err = null;
    this.msg = null;
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
    departmentId: ['', Validators.required],
    drCode: ['', Validators.required],
    fee: [''],
    remarks: '',
    paymentStatus: [false],
    confirmed: [false],
  });

  updateFormValues(): void {
    if (this.selected) {
      const formattedDate = this.datePipe.transform(this.selected().date, 'yyyy-MM-dd');
      this.appointmentForm.patchValue({
        pName: this.selected().pName,
        age: this.selected().age,
        sex: this.selected().sex,
        mobile: this.selected().mobile,
        type: this.selected().type?.toString(),
        date: formattedDate || '',
        sL: this.selected().sl,
        departmentId: this.selected().departmentId,
        drCode: this.selected().drCode,
        fee: this.selected().fee,
        remarks: this.selected().remarks,
        paymentStatus: this.selected().paymentStatus,
        confirmed: this.selected().confirmed,
      });
    }
  }

  onSubmit(): void {
    this.isSubmitted.set(true);

    if (this.appointmentForm.invalid) {
      return;
    }

    const formData = new FormData();
    const formValue = this.appointmentForm.value;

    Object.keys(formValue).forEach(key => {
      const value = formValue[key as keyof typeof formValue];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (this.selected()) {
      this.updateAppointment(formData);
    } else {
      this.createAppointment(formData);
    }
  }

  private createAppointment(formData: FormData): void {
    this.subscriptions.push(
      this.appointmentService.addAppointment(formData).subscribe({
        next: () => {
          this.msg = "Appointment successfully created!";
          this.confirmModal.set(true);
          setTimeout(() => this.closeAppointmentModal(), 2000);
        },
        error: (error) => {
          this.handleError(error);
        }
      })
    );
  }

  private updateAppointment(formData: FormData): void {
    this.subscriptions.push(
      this.appointmentService.updateAppointment(this.selected().id, formData).subscribe({
        next: () => {
          this.msg = "Appointment successfully updated!";
          this.confirmModal.set(true);
          setTimeout(() => this.closeAppointmentModal(), 2000);
        },
        error: (error) => {
          this.handleError(error);
        }
      })
    );
  }

  private handleError(error: any): void {
    this.err = error?.error?.message || 'An error occurred while processing your request';
    this.confirmModal.set(true);
    console.error('Error:', error);
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}