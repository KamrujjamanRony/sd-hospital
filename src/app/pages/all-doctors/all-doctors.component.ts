import { Component, Renderer2 } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DoctorsService } from '../../features/services/doctors.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { environment } from '../../../environments/environments';
import { DoctorCardComponent } from "../../components/shared/doctor-card/doctor-card.component";

@Component({
    selector: 'app-all-doctors',
    standalone: true,
    templateUrl: './all-doctors.component.html',
    styleUrl: './all-doctors.component.css',
    imports: [CommonModule, RouterLink, CoverComponent, DoctorCardComponent]
})
export class AllDoctorsComponent {
  yourTitle: any = 'all doctors list';
  yourSub1: any = 'Home';
  yourSub2: any = 'Doctors';
  emptyImg: any = '../../../../assets/images/doctor.png';
  
  hospitalDoctors$?: Observable<any[]>;
  hospitalCode: any = environment.hospitalCode;

  constructor(private doctorsService: DoctorsService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.hospitalDoctors$ = this.doctorsService.getCompanyDoctor();
  }

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
