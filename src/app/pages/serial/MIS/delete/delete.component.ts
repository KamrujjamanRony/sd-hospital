import { Component, inject } from '@angular/core';
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
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
  appointmentsService = inject(AppointmentsService);
  modelAppointment: any;
  show: boolean = false;
  message: string = '';
  appointmentSubscription?: Subscription;

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
    if (this.modelAppointment.FromDate) {
      this.onOpen();
    }
  }

  onConfirm(){
    console.log(this.modelAppointment.password)
    if (this.modelAppointment.password == environment.authKey) {
      console.log(this.modelAppointment.FromDate, this.modelAppointment.ToDate);
      this.appointmentSubscription = this.appointmentsService.deleteAllAppointmentData(this.modelAppointment.FromDate, this.modelAppointment.ToDate).subscribe({
        next: (data) => {
          this.message = data.message;
          this.show = false;
        },
        error: (error) => {
          console.log(error.error.message);
          this.message = error.error.message + " " + this.modelAppointment.FromDate + " to " + (this.modelAppointment.ToDate ? this.modelAppointment.ToDate : this.modelAppointment.FromDate);
          this.show = false;
        }
      });
    }
  }

  resetAppointmentForm(): void {
    this.modelAppointment = {
      FromDate: '',
      ToDate: '',
      password: '',
    };
    this.message = '';
  }

  onOpen(){
    this.show = true;
    this.message = '';
  }

  onClose(){
    this.show = false;
    this.resetAppointmentForm();
  }

  //============================= Destroy All Subscription =============================
  ngOnDestroy(): void {
    this.appointmentSubscription?.unsubscribe();
  }

}
