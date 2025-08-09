import { Component, Renderer2, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environments';
import { DoctorCardComponent } from "../../../components/main/shared/all-cards/doctor-card/doctor-card.component";
import { DoctorsService } from '../../../services/serial/doctors.service';

@Component({
  selector: 'app-all-doctors',
  templateUrl: './all-doctors.component.html',
  styleUrl: './all-doctors.component.css',
  imports: [CommonModule, DoctorCardComponent]
})
export class AllDoctorsComponent {
  doctorsService = inject(DoctorsService);
  renderer = inject(Renderer2);

  emptyImg: any = '../../../../assets/images/doctor.png';
  hospitalDoctors$?: Observable<any[]>;
  hospitalCode: any = environment.hospitalCode;

  constructor() { }

  ngOnInit(): void {
    this.hospitalDoctors$ = this.doctorsService.getCompanyDoctor()
  }

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
