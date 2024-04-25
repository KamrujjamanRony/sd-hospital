import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DoctorsService } from '../../../../features/services/doctors.service';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { CommonModule } from '@angular/common';
import { DoctorCardComponent } from "../../../shared/doctor-card/doctor-card.component";

@Component({
    selector: 'app-our-doctors',
    standalone: true,
    templateUrl: './our-doctors.component.html',
    imports: [RouterLink, CommonModule, DoctorCardComponent]
})
export class OurDoctorsComponent {
  hospitalDoctors$?: Observable<any[]>;

  constructor(private router: Router, private renderer: Renderer2, private doctorsService: DoctorsService) {}

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
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
