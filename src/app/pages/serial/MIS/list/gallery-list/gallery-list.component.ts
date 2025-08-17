import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { GalleryService } from '../../../../../services/main/gallery.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-gallery-list',
  imports: [CommonModule, CoverComponent, RouterLink, DeleteConfirmationModalComponent],
  templateUrl: './gallery-list.component.html',
  styleUrl: './gallery-list.component.css'
})
export class GalleryListComponent {
  galleryService = inject(GalleryService);
  gallery$?: Observable<any[]>;
  deleteGallerySubscription?: Subscription;
  companyID: any = environment.hospitalCode;
  emptyImg: any = environment.emptyImg;

  loading = signal<boolean>(true);
  isConfirmOpen = signal<boolean>(false);
  idToDelete = signal<any>(null);

  constructor() { }

  ngOnInit(): void {
    if (!this.gallery$) {
      this.loading.set(false);
      this.gallery$ = this.galleryService.getCompanyGallery().pipe(
        map(doctors => doctors.sort((a, b) => a.galerySerial - b.galerySerial))
      );
    }
  }

  onDelete(id: any): void {
    this.idToDelete.set(id);
    this.isConfirmOpen.set(true);
  }

  confirmDelete(): void {
    this.deleteGallerySubscription = this.galleryService.deleteGallery(this.idToDelete()).subscribe({
      next: () => {
        this.gallery$ = this.galleryService.getCompanyGallery();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isConfirmOpen.set(false);
  }

  ngOnDestroy(): void {
    this.deleteGallerySubscription?.unsubscribe();
  }

}
