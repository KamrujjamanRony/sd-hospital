import { Component, input, signal } from '@angular/core';
import { DoctorDetailsComponent } from '../shared/modal/doctor-details/doctor-details.component';
import { AppointmentModalSerialComponent } from '../shared/modal/appointment-modal-serial/appointment-modal-serial.component';

@Component({
  selector: 'app-doctor-card',
  imports: [DoctorDetailsComponent, AppointmentModalSerialComponent],
  templateUrl: './doctor-card.component.html'
})
export class DoctorCardComponent {
  readonly doctor = input<any>();
  readonly department = input.required<string>();
  showModal = signal<boolean>(false);
  showAppointment = signal<boolean>(false);
  doctorMale = '../../../assets/images/doctor.png';

  constructor() { }

  handleClick() {
    this.showAppointment.set(true);
    this.showModal.set(false);
  }

  openDoctorDetails() {
    this.showAppointment.set(true);
  }

  openAppointment() {
    this.showAppointment.set(true);
  }

  closeDoctorDetails() {
    this.showModal.set(false);
  }

  closeAppointment() {
    this.showAppointment.set(false);
  }

}
