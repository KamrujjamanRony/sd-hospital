import { Component } from '@angular/core';
import { AppointmentModalComponent } from "../../shared/all-modals/appointment-modal/appointment-modal.component";

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.css',
    imports: [AppointmentModalComponent]
})
export class HeroComponent {
  appointmentImageUrl = "https://img.freepik.com/free-photo/gradient-dark-blue-futuristic-digital-background_53876-160646.jpg?t=st=1713524092~exp=1713527692~hmac=5bb425a06bba38ab6c2073c0e5a8b5e98ea2571bcabddb638fec4a93bd33e3d0&w=1380";
  showAppointment: boolean = false;

  openAppointment() {
    this.showAppointment = true;
  }

  closeAppointment() {
    this.showAppointment = false;
  }

}
