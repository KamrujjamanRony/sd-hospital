import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CoverComponent } from "../../../components/shared/cover/cover.component";
import { Observable } from 'rxjs';
import { GalleryService } from '../../../features/services/gallery.service';
import { GalleryCardComponent } from "../../../components/shared/gallery-card/gallery-card.component";

@Component({
    selector: 'app-hospital-gallery',
    standalone: true,
    templateUrl: './hospital-gallery.component.html',
    imports: [CommonModule, CoverComponent, GalleryCardComponent]
})
export class HospitalGalleryComponent {
  gallery$?: Observable<any[]>;
  gallery?: any;
  constructor(private GalleryService: GalleryService) {
    if (!this.gallery$) {
      this.gallery$ = GalleryService.getCompanyGallery();
      this.gallery$.subscribe(data => {
        this.gallery = data;
      })
    }
  }

}
