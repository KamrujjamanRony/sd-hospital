import { Component, input, signal } from '@angular/core';
import { DoctorDetailsComponent } from '../shared/modal/doctor-details/doctor-details.component';
import { AppointmentModalSerialComponent } from '../shared/modal/appointment-modal-serial/appointment-modal-serial.component';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  templateUrl: './doctor-card.component.html',
  imports: [DoctorDetailsComponent, AppointmentModalSerialComponent]
})
export class DoctorCardComponent {
  doctor = input.required<any>();
  department = input<boolean>(true);

  showModal = signal<boolean>(false);
  showAppointment = signal<boolean>(false);

  doctorMale = './images/doctor.png';

  openDoctorDetails(): void {
    console.log('Opening doctor details');
    this.showModal.set(true);
  }

  closeDoctorDetails(): void {
    console.log('Closing doctor details');
    this.showModal.set(false);
  }

  openAppointment(): void {
    console.log('Opening appointment from card button');
    this.showAppointment.set(true);
  }

  closeAppointment(): void {
    console.log('Closing appointment');
    this.showAppointment.set(false);
  }

  // This method handles the appointment button click from Doctor Details
  handleAppointmentClick(): void {
    console.log('Appointment button clicked from Doctor Details');
    this.showModal.set(false); // Close doctor details modal
    this.showAppointment.set(true); // Open appointment modal
  }

  // Generic handle click method
  handleClick(): void {
    console.log('Handle click called');
    // You can add any additional logic here if needed
  }
}