import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  Validation,
  Input,
  initTE,
  Datepicker
} from 'tw-elements';
import { AppointmentsService } from '../../../../services/serial/appointments.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-delete',
  imports: [FormsModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
  appointmentsService = inject(AppointmentsService);
  appointmentSubscription?: Subscription;
  modelAppointment = signal<any>(null);
  show = signal<boolean>(false);
  message = signal<string>('');

  constructor() {
    this.resetAppointmentForm();
  }
  ngOnInit(): void {
    initTE(
      { Validation, Input, Datepicker },
      { allowReinits: true }
    );
  }

  //============================= Appointment =============================
  onAppointmentFormSubmit(): void {
    if (this.modelAppointment().FromDate) {
      this.onOpen();
    }
  }

  onConfirm() {
    console.log(this.modelAppointment().password)
    if (this.modelAppointment().password == environment.authKey) {
      console.log(this.modelAppointment().FromDate, this.modelAppointment().ToDate);
      this.appointmentSubscription = this.appointmentsService.deleteAllAppointmentData(this.modelAppointment().FromDate, this.modelAppointment().ToDate).subscribe({
        next: (data) => {
          this.message.set(data.message);
          this.show.set(false);
        },
        error: (error) => {
          console.log(error.error.message);
          this.message.set(error.error.message + " " + this.modelAppointment().FromDate + " to " + (this.modelAppointment().ToDate ? this.modelAppointment().ToDate : this.modelAppointment().FromDate));
          this.show.set(false);
        }
      });
    }
  }

  resetAppointmentForm(): void {
    this.modelAppointment.set({
      FromDate: '',
      ToDate: '',
      password: '',
    });
    this.message.set('');
  }

  onOpen() {
    this.show.set(true);
    this.message.set('');
  }

  onClose() {
    this.show.set(false);
    this.resetAppointmentForm();
  }

  //============================= Destroy All Subscription =============================
  ngOnDestroy(): void {
    this.appointmentSubscription?.unsubscribe();
  }

}
