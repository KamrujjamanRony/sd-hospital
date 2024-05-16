import { Component, Renderer2, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DoctorsService } from '../../../services/main/doctors.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoverComponent } from "../../../components/main/shared/cover/cover.component";
import { environment } from '../../../../environments/environments';
import { DoctorCardComponent } from "../../../components/main/shared/all-cards/doctor-card/doctor-card.component";

@Component({
    selector: 'app-all-doctors',
    standalone: true,
    templateUrl: './all-doctors.component.html',
    styleUrl: './all-doctors.component.css',
    imports: [CommonModule, RouterLink, CoverComponent, DoctorCardComponent]
})
export class AllDoctorsComponent {
  doctorsService = inject(DoctorsService);
  renderer = inject(Renderer2);
  
  emptyImg: any = '../../../../assets/images/doctor.png';
  hospitalDoctors$?: Observable<any[]>;
  hospitalCode: any = environment.hospitalCode;

  constructor() {}

  ngOnInit(): void {
    this.hospitalDoctors$ = this.doctorsService.getCompanyDoctor();
  }

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
