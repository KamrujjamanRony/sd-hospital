import { Component, input } from '@angular/core';
import { DoctorDetailsComponent } from '../shared/modal/doctor-details/doctor-details.component';
import { AppointmentModalComponent } from '../shared/modal/appointment-modal/appointment-modal.component';

@Component({
    selector: 'app-doctor-card',
    imports: [DoctorDetailsComponent, AppointmentModalComponent],
    templateUrl: './doctor-card.component.html'
})
export class DoctorCardComponent {
  readonly doctor = input<any>();
  readonly department = input.required<string>();
  showModal: boolean = false;
  showAppointment: boolean = false;
  doctorMale = '../../../assets/images/doctor.png';

  constructor() { }

  handleClick() {
    this.showAppointment = true;
    this.showModal = false;
  }

  openDoctorDetails() {
    this.showModal = true;
  }

  openAppointment() {
    this.showAppointment = true;
  }

  closeDoctorDetails() {
    this.showModal = false;
  }

  closeAppointment() {
    this.showAppointment = false;
  }

}
