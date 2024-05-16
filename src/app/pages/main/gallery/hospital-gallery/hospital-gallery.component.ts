import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CoverComponent } from "../../../../components/main/shared/cover/cover.component";
import { Observable } from 'rxjs';
import { GalleryService } from '../../../../services/main/gallery.service';
import { GalleryCardComponent } from "../../../../components/main/shared/all-cards/gallery-card/gallery-card.component";

@Component({
  selector: 'app-hospital-gallery',
  standalone: true,
  templateUrl: './hospital-gallery.component.html',
  imports: [CommonModule, CoverComponent, GalleryCardComponent]
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
