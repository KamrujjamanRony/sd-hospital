import { Component, input, signal } from '@angular/core';
import { DoctorDetailsComponent } from '../../../../serial/shared/modal/doctor-details/doctor-details.component';
import { AppointmentModalComponent } from '../../all-modals/appointment-modal/appointment-modal.component';

@Component({
  selector: 'app-doctor-card',
  imports: [DoctorDetailsComponent, AppointmentModalComponent],
  templateUrl: './doctors-card.component.html'
})
export class MainDoctorsCardComponent {
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
    this.showModal.set(true);
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
