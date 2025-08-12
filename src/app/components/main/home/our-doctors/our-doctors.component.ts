import { Component, Renderer2, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorCardComponent } from "../../shared/all-cards/doctor-card/doctor-card.component";
import { DoctorsService } from '../../../../services/serial/doctors.service';

@Component({
  selector: 'app-our-doctors',
  templateUrl: './our-doctors.component.html',
  imports: [RouterLink, CommonModule, DoctorCardComponent]
})
export class OurDoctorsComponent {
  router = inject(Router);
  renderer = inject(Renderer2);
  doctorsService = inject(DoctorsService);
  hospitalDoctors = signal<any[]>([]);

  constructor() { }

  ngOnInit(): void {
    this.doctorsService.getCompanyDoctor().subscribe(data => {
      this.hospitalDoctors.set(data);
    });
  }

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
