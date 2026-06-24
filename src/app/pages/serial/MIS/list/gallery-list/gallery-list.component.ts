import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-gallery-list',
  imports: [CoverComponent, RouterLink],
  templateUrl: './gallery-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gallery-list.component.css'
})
export class GalleryListComponent {
  store = inject(AppStore);
  galleries = this.store.galleries;
  emptyImg: any = environment.emptyImg;

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteGallery(id);
    }
  }
}
