import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { format, isBefore } from 'date-fns';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ToastService } from '../../../../../services/serial/toast.service';
import { AppointmentService } from '../../../../../services/serial/appointment.service';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { AuthService } from '../../../../../services/serial/auth.service';
import { DepartmentService } from '../../../../../services/serial/department.service';

@Component({
    selector: 'app-appointment-modal',
    templateUrl: './appointment-modal.component.html',
    styleUrl: './appointment-modal.component.css',
    providers: [DatePipe],
    imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent]
})
export class AppointmentModalComponent {
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

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  format = format;
  selected!: any;
  selectedDoctor: any;
  doctorList: any;
  confirmModal: boolean = false;
  user: any;
  errorMessage: string | null = null;

  constructor(){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.selected = this.appointmentService.getAppointment(this.id());
    this.selectedDoctor = this.doctor();
  }

  closeModal() {
    this.confirmModal = false;
  }

  departmentQuery = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }));

  doctorQuery = injectQuery(() => ({
    queryKey: ['doctors'],
    queryFn: () => this.doctorsService.getDoctors(),
  }));

  appointmentMutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.appointmentService.addAppointment(formData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error: any) => {
      this.handleError(error);
    }
  }));

  UpdateAppointmentMutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.appointmentService.updateAppointment(this.selected.id, formData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error: any) => {
      this.handleError(error);
    }
  }));

  private handleError(error: any) {
    this.errorMessage = error.message || 'An error occurred. Please try again.';
    console.error(error);
  }

}
