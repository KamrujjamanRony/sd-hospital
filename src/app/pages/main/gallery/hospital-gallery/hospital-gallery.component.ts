
import { Component, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryService } from '../../../../services/main/gallery.service';
import { GalleryCardComponent } from "../../../../components/main/shared/all-cards/gallery-card/gallery-card.component";

@Component({
  selector: 'app-hospital-gallery',
  templateUrl: './hospital-gallery.component.html',
  imports: [GalleryCardComponent]
})
export class HospitalGalleryComponent {
  galleryService = inject(GalleryService);
  gallery = signal<any[]>([]);

  ngOnInit(): void {
    this.galleryService.getCompanyGallery().subscribe(data => {
      this.gallery.set(data);
    })
  }

}
