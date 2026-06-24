import { Component, Renderer2, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorCardComponent } from "../../shared/all-cards/doctor-card/doctor-card.component";
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-our-doctors',
  templateUrl: './our-doctors.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, CommonModule, DoctorCardComponent]
})
export class OurDoctorsComponent {
  private store = inject(AppStore);

  // Select signals from the store
  hospitalDoctors = this.store.doctors;
  loading = this.store.loading;
  router = inject(Router);
  renderer = inject(Renderer2);

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
