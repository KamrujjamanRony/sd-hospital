import { Component, Renderer2, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-doctor-card',
    imports: [RouterLink],
    templateUrl: './doctor-card.component.html',
    styleUrl: './doctor-card.component.css'
})
export class DoctorCardComponent {
  readonly doctor = input.required<any>();
  renderer = inject(Renderer2);
  doctorMale = '../../../../assets/images/doctor.png';
  doctorFemale = '../../../../assets/images/Dr-Famale.jpg';

  constructor() {}

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
