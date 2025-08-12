import { Component, Renderer2, inject, signal } from '@angular/core';
import { GalleryService } from '../../../../services/main/gallery.service';
import { GalleryCardComponent } from "../../shared/all-cards/gallery-card/gallery-card.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-our-hospital-gallery',
  templateUrl: './our-hospital-gallery.component.html',
  styleUrl: './our-hospital-gallery.component.css',
  imports: [GalleryCardComponent, RouterLink, CommonModule]
})
export class OurHospitalGalleryComponent {
  galleryService = inject(GalleryService);
  renderer = inject(Renderer2);
  gallery = signal<any[]>([]);

  ngOnInit(): void {
    this.galleryService.getCompanyGallery().subscribe(data => {
      this.gallery.set(data);
    })
  }

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
