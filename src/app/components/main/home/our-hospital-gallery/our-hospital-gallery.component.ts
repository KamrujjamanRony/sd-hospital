import { Component, Renderer2, inject, ChangeDetectionStrategy } from '@angular/core';
import { GalleryCardComponent } from "../../shared/all-cards/gallery-card/gallery-card.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-our-hospital-gallery',
  templateUrl: './our-hospital-gallery.component.html',
  styleUrl: './our-hospital-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [GalleryCardComponent, RouterLink, CommonModule]
})
export class OurHospitalGalleryComponent {
  private store = inject(AppStore);
  renderer = inject(Renderer2);
  gallery = this.store.galleries;

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
