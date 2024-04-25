import { Component, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryService } from '../../../../features/services/gallery.service';
import { InstrumentCardComponent } from "../../../shared/instrument-card/instrument-card.component";
import { GalleryCardComponent } from "../../../shared/gallery-card/gallery-card.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-our-hospital-gallery',
    standalone: true,
    templateUrl: './our-hospital-gallery.component.html',
    styleUrl: './our-hospital-gallery.component.css',
    imports: [InstrumentCardComponent, GalleryCardComponent, RouterLink]
})
export class OurHospitalGalleryComponent {
  gallery$?: Observable<any[]>;
  gallery?: any;
  constructor(private GalleryService: GalleryService, private renderer: Renderer2) {
    if (!this.gallery$) {
      this.gallery$ = GalleryService.getCompanyGallery();
      this.gallery$.subscribe(data => {
        this.gallery = data.slice(0,3);
      })
    }
  }

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
