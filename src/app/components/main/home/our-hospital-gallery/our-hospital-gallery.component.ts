import { Component, Renderer2, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryService } from '../../../../services/main/gallery.service';
import { InstrumentCardComponent } from "../../shared/all-cards/instrument-card/instrument-card.component";
import { GalleryCardComponent } from "../../shared/all-cards/gallery-card/gallery-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-our-hospital-gallery',
  standalone: true,
  templateUrl: './our-hospital-gallery.component.html',
  styleUrl: './our-hospital-gallery.component.css',
  imports: [InstrumentCardComponent, GalleryCardComponent, RouterLink]
})
export class OurHospitalGalleryComponent {
  galleryService = inject(GalleryService);
  renderer = inject(Renderer2);
  gallery$?: Observable<any[]>;
  gallery?: any;
  constructor() { }

  ngOnInit(): void {
    this.gallery$ = this.galleryService.getCompanyGallery();
    this.gallery$.subscribe(data => {
      this.gallery = data.slice(0, 3);
    })
  }

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
