import { Component, Renderer2, inject, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { DoctorCardComponent } from "../../../components/main/shared/all-cards/doctor-card/doctor-card.component";
import { HomeCover } from "../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../store/app.store';

@Component({
  selector: 'app-all-doctors',
  templateUrl: './all-doctors.component.html',
  styleUrl: './all-doctors.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DoctorCardComponent, HomeCover]
})
export class AllDoctorsComponent {
  private store = inject(AppStore);
  renderer = inject(Renderer2);

  emptyImg: any = './images/doctor.png';
  doctors = this.store.doctors;
  hospitalCode: any = environment.hospitalCode;

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
