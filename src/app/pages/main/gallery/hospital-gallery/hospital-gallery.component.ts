
import { Component, inject } from '@angular/core';
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

  gallery$?: Observable<any[]>;
  gallery?: any;

  constructor() { }

  ngOnInit(): void {
    this.gallery$ = this.galleryService.getCompanyGallery();
    this.gallery$.subscribe(data => {
      this.gallery = data;
    })
  }

}
