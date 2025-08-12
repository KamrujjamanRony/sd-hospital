import { DatePipe } from '@angular/common';
import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { format, isBefore } from 'date-fns';
import { Observable, Subscription } from 'rxjs';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ToastService } from '../../../../../services/serial/toast.service';
import { AppointmentService } from '../../../../../services/serial/appointment.service';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { AuthService } from '../../../../../services/serial/auth.service';
import { DepartmentService } from '../../../../../services/serial/department.service';
import { environment } from '../../../../../../environments/environments';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.css',
  providers: [DatePipe],
  imports: [ReactiveFormsModule, ConfirmModalComponent]
})
export class AppointmentModalComponent implements OnInit {
  datePipe = inject(DatePipe);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  authService = inject(AuthService);
  readonly doctor = input<any>();
  readonly id = input.required<any>();
  readonly closeAppointment = output<void>();
  private subscriptions: Subscription[] = [];

  // Form state
  format = format;
  selected = signal<any>(null);
  selectedDoctor = signal<any>(null);
  doctorList = signal<any>(null);
  confirmModal = signal<boolean>(false);
  user = signal<any>(null);
  errorMessage = signal<any>(null);
  isSubmitting = signal<boolean>(false);

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.selected.set(this.appointmentService.getAppointment(this.id()));
    this.selectedDoctor.set(this.doctor());
  }

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  closeModal() {
    this.confirmModal.set(false);
  }

  onDepartmentChange() {
    if (this.appointmentForm.value.departmentId) {
      this.subscriptions.push(
        this.doctorsService.getDoctors().subscribe({
          next: (doctors) => {
            this.doctorList.set(doctors.filter(d => d.departmentId === this.appointmentForm.value.departmentId));
          },
          error: (error) => {
            console.error('Error loading doctors:', error);
          }
        })
      );
    }
  }

  private handleError(error: any) {
    this.errorMessage.set(error.message || 'An error occurred. Please try again.');
    console.error(error);
    this.isSubmitting.set(false);
  }

  onSubmit(): void {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = this.prepareFormData();

    const operation$ = this.selected()?.id
      ? this.appointmentService.updateAppointment(this.selected().id, formData)
      : this.appointmentService.addAppointment(formData);

    this.subscriptions.push(
      operation$.subscribe({
        next: () => {
          this.confirmModal.set(true);
          this.isSubmitting.set(false);
          this.closeAppointmentModal();
        },
        error: (error) => {
          this.handleError(error);
        }
      })
    );
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const values = this.appointmentForm.value;

    // Add all form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return formData;
  }

  // Your existing form definition
  appointmentForm = this.fb.group({
    companyID: [environment.hospitalCode],
    pName: ['', Validators.required],
    age: [''],
    mobile: [''],
    sex: [''],
    type: ['true'],
    date: ['', Validators.required],
    sL: [''],
    departmentId: [''],
    drCode: [''],
    fee: [''],
    remarks: '',
    paymentStatus: [false],
    confirmed: [false],
  });

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}