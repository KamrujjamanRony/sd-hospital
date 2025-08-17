import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { GalleryService } from '../../../../../services/main/gallery.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';
import { environment } from '../../../../../../environments/environments';

@Component({
  selector: 'app-add-gallery',
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './add-gallery.component.html',
  styleUrl: './add-gallery.component.css'
})
export class AddGalleryComponent {
  galleryService = inject(GalleryService);
  imgbbService = inject(ImgbbService);

  model: any;
  private addGallerySubscription?: Subscription;
  confirmModal = signal<boolean>(false);

  closeModal() {
    this.confirmModal.set(false);
  }

  constructor() {
    this.model = {
      companyID: environment.hospitalCode,
      galerySerial: null,
      galeryName: "",
      description: "",
      gPicUrl: "",
    };
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model().companyID);
    formData.append('GalerySerial', this.model().galerySerial);
    formData.append('GaleryName', this.model().galeryName);
    formData.append('Description', this.model().description);
    formData.append('GPicUrl', this.model().gPicUrl);

    this.addGallerySubscription = this.galleryService.addGallery(formData)
      .subscribe({
        next: (response) => {
          this.confirmModal.set(true);
        },
        error: (error) => {
          console.error('Error adding Gallery:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.addGallerySubscription?.unsubscribe();
  }

}
