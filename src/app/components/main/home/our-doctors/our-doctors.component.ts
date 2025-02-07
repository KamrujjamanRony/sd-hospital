import { Component, Renderer2, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DoctorsServiceMain } from '../../../../services/main/doctors.service';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { CommonModule } from '@angular/common';
import { DoctorCardComponent } from "../../shared/all-cards/doctor-card/doctor-card.component";

@Component({
    selector: 'app-our-doctors',
    templateUrl: './our-doctors.component.html',
    imports: [RouterLink, CommonModule, DoctorCardComponent]
})
export class OurDoctorsComponent {
  router = inject(Router);
  renderer = inject(Renderer2);
  doctorsService = inject(DoctorsServiceMain);
  hospitalDoctors$?: Observable<any[]>;

  constructor() {}

  ngOnInit(): void {
    this.hospitalDoctors$ = this.doctorsService.getAllDoctor().pipe(
      map((doctors: any[]) =>
        doctors.filter((doctor: any) => doctor.companyID == environment.hospitalCode)
      ),
      map((filteredDoctors: any[]) =>
        filteredDoctors.slice(0, 3)
      )
    );
  }

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
