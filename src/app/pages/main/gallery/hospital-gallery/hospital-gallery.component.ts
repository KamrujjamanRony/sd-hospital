
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { GalleryCardComponent } from "../../../../components/main/shared/all-cards/gallery-card/gallery-card.component";
import { HomeCover } from "../../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-hospital-gallery',
  templateUrl: './hospital-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [GalleryCardComponent, HomeCover]
})
export class HospitalGalleryComponent {
  private store = inject(AppStore);
  gallery = this.store.galleries;
}
